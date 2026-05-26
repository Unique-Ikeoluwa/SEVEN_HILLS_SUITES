const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8300;

// Import database models
const db = require("./models");
const { Message, Users } = db;

// Socket.io initialization with CORS
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
global.io = io;

// Socket.io JWT Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;

  if (!token) {
    return next(new Error("Authentication error: JWT token is missing."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user payload to socket
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid or expired token."));
  }
});

// Socket.io Connection Handler
io.on("connection", async (socket) => {
  // Fetch full user profile to get the name
  let fullName = "User";
  try {
    const user = await Users.findByPk(socket.user.id);
    if (user) {
      fullName = user.fullName;
      socket.user.fullName = user.fullName;
    }
  } catch (err) {
    console.error("Socket error fetching user profile:", err);
  }

  console.log(`[SOCKET] User connected: ${fullName} (${socket.user.role}) [ID: ${socket.user.id}]`);

  // Handle joining a support room
  socket.on("join_room", ({ roomUserId }) => {
    if (!roomUserId) return;

    // A user can join their own room. Admin/support can join any user's room.
    const isSelfRoom = socket.user.id === roomUserId;
    const isAdminRole = socket.user.role === "admin" || socket.user.role === "support";

    if (isSelfRoom || isAdminRole) {
      const roomName = `room_${roomUserId}`;
      socket.join(roomName);
      console.log(`[SOCKET] ${fullName} (${socket.user.role}) joined ${roomName}`);
    } else {
      console.warn(`[SOCKET] Unauthorized room join attempt: user ${socket.user.id} tried joining room_${roomUserId}`);
    }
  });

  // Handle sending support messages
  socket.on("send_message", async ({ roomUserId, text }) => {
    if (!roomUserId || !text || text.trim() === "") return;

    try {
      const isSenderAdmin = socket.user.role === "admin" || socket.user.role === "support";

      // Save message to database
      const savedMessage = await Message.create({
        sender_id: socket.user.id,
        receiver_id: isSenderAdmin ? roomUserId : null, // If admin sends, receiver is the user. If user sends, receiver is support (null)
        text: text.trim(),
        room_id: roomUserId,
        is_read: false
      });

      // Fetch sender association details to send along
      const messagePayload = {
        id: savedMessage.id,
        sender_id: savedMessage.sender_id,
        receiver_id: savedMessage.receiver_id,
        text: savedMessage.text,
        room_id: savedMessage.room_id,
        is_read: savedMessage.is_read,
        createdAt: savedMessage.createdAt,
        sender: {
          id: socket.user.id,
          fullName: socket.user.fullName || fullName,
          role: socket.user.role
        }
      };

      const roomName = `room_${roomUserId}`;
      // Broadcast to everyone in the room (user and any active admins)
      io.to(roomName).emit("receive_message", messagePayload);

      // If sent by a normal user, notify all support/admin connections globally
      if (!isSenderAdmin) {
        io.emit("admin_new_message_notification", {
          room_id: roomUserId,
          text: savedMessage.text,
          senderName: socket.user.fullName || fullName,
          createdAt: savedMessage.createdAt
        });
      }
    } catch (err) {
      console.error("[SOCKET] Error saving message:", err);
      socket.emit("error", { message: "Failed to send message." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`[SOCKET] User disconnected: ${fullName}`);
  });
});

// Bind API Routes
const apiRoutes = require("./routes");
app.use("/", apiRoutes);

// Welcome / Fallback route
app.get("/", (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "Welcome to Seven Hills Suites API",
    });
});

// Connect DB and Start HTTP + WS Server
db.sequelize.authenticate()
  .then(() => {
    server.listen(PORT, () => {
      console.log(
        `Database connected successfully and Server running on PORT:${PORT}`
      );
    });
  })
  .catch((e) => {
    console.log(`Database connection failed:`, e);
  });


  