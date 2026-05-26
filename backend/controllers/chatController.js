const db = require("../models");
const { Message, Users } = db;

// Helper to check if user is admin/support
const isAdmin = (user) => {
  return user && (user.role === "admin" || user.role === "support");
};


// Get Chat History (User & Admin both can request)
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params; // Scoped by user ID (the room name)
    const currentUserId = req.user.id;

    // Verify permission: user can only see their own chat history, admin can see anyone's
    if (currentUserId !== userId && !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to view this chat history.",
      });
    }

    const history = await Message.findAll({
      where: { room_id: userId },
      include: [
        {
          model: Users,
          as: "sender",
          attributes: ["id", "fullName", "email", "role"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get Chat History Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching chat history.",
      error: error.message,
    });
  }
};

// Get Active Chat Rooms (Admin Only)
// Returns all unique user rooms, with the latest message and details about the user
exports.getRooms = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view support chat rooms.",
      });
    }

    // Direct SQL query using DISTINCT ON to find the latest message from each room
    const latestMessages = await db.sequelize.query(
      `SELECT DISTINCT ON (room_id) id, room_id, text, sender_id, receiver_id, is_read, "createdAt" 
       FROM messages 
       ORDER BY room_id, "createdAt" DESC`,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    // Fetch user details for each room (room_id corresponds to the user's UUID)
    const rooms = await Promise.all(
      latestMessages.map(async (msg) => {
        const user = await Users.findByPk(msg.room_id, {
          attributes: ["id", "fullName", "email", "phone_no"],
        });

        // Count unread messages in this room (sent by the user, so receiver is null/admin and is_read is false)
        const unreadCount = await Message.count({
          where: {
            room_id: msg.room_id,
            sender_id: msg.room_id, // sent by user
            is_read: false,
          },
        });

        return {
          room_id: msg.room_id,
          user: user || { id: msg.room_id, fullName: "Guest User", email: "guest@sevenhills.com" },
          latestMessage: {
            id: msg.id,
            text: msg.text,
            sender_id: msg.sender_id,
            is_read: msg.is_read,
            createdAt: msg.createdAt,
          },
          unreadCount,
        };
      })
    );

    // Sort rooms by the latest message's createdAt date descending
    rooms.sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt));

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error("Get Chat Rooms Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching support chat rooms.",
      error: error.message,
    });
  }
};

// Mark Messages in a Chat Room as Read
exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params; // The room user ID
    const currentUserId = req.user.id;

    let updateCondition = {};

    if (isAdmin(req.user)) {
      // Admin marking messages as read: means the messages sent by the User (sender_id = userId)
      updateCondition = {
        room_id: userId,
        sender_id: userId,
        is_read: false,
      };
    } else {
      // User marking messages as read: means messages sent by admins/support (sender_id != userId)
      if (currentUserId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }

      updateCondition = {
        room_id: userId,
        sender_id: {
          [db.Sequelize.Op.ne]: userId,
        },
        is_read: false,
      };
    }

    await Message.update({ is_read: true }, { where: updateCondition });

    return res.status(200).json({
      success: true,
      message: "Messages marked as read.",
    });
  } catch (error) {
    console.error("Mark As Read Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while marking messages as read.",
      error: error.message,
    });
  }
};
