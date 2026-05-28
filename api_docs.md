# Seven Hills Suites - API Specification Reference

This document serves as the absolute technical reference for frontend engineers integrating with the Seven Hills Suites backend.

---

## 🔑 Authentication Services

### 1. User Registration
* **Endpoint**: `POST /auth/register`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "password": "SecretPassword123",
  "phone_no": "08012345678"
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for the verification code.",
  "data": {
    "id": "e30cb7b8-2a1f-44e2-9b2f-3f62916b9b3e",
    "fullName": "John Doe",
    "is_active": false
  }
}
```

### 2. Verify Email OTP
* **Endpoint**: `POST /auth/verify-otp`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "email": "johndoe@example.com",
  "otpCode": "123456"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Account verified successfully! You can now log in."
}
```

### 3. User Login
* **Endpoint**: `POST /auth/login`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "email": "johndoe@example.com",
  "password": "SecretPassword123"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "e30cb7b8-2a1f-44e2-9b2f-3f62916b9b3e",
      "fullName": "John Doe",
      "email": "johndoe@example.com",
      "phone_no": "08012345678",
      "role": "user"
    }
  }
}
```
> [!NOTE]
> Upon successful login, the backend transitions the user's `is_active` state to `true`.

### 4. Admin Registration
* **Endpoint**: `POST /auth/register-admin`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "fullName": "Admin Staff",
  "email": "admin@sevenhills.com",
  "password": "AdminSecurePassword1",
  "phone_no": "+234800000000"
}
```
* **Success Response (210 Created)**:
```json
{
  "success": true,
  "message": "Admin registered successfully!",
  "data": {
    "id": "8bb380aa-2a2b-42ef-bd8f-c38a209b55ef",
    "fullName": "Admin Staff",
    "email": "admin@sevenhills.com",
    "role": "admin",
    "is_verified": true
  }
}
```

### 5. User Logout
* **Endpoint**: `POST /auth/logout`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```
> [!NOTE]
> Upon successful logout, the backend transitions the user's `is_active` state to `false`.

---

## 🏨 Apartment Services

### 1. Retrieve Available Apartments
* **Endpoint**: `GET /apartments`
* **Query Parameters**:
  - `location` (Optional, string)
  - `minPrice` (Optional, string)
  - `maxPrice` (Optional, string)
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Royal Gold Suite",
      "description": "Ultra luxury suite with gold finishes",
      "location": "Abuja, Nigeria",
      "price": "150000",
      "status": "available",
      "amenities": "Wifi,Pool,Gym,AC",
      "apartment_type": "Penthouse",
      "images": "https://res.cloudinary.com/.../img1.jpg,https://res.cloudinary.com/.../img2.jpg",
      "videos": "https://res.cloudinary.com/.../vid1.mp4"
    }
  ]
}
```

### 2. Create Apartment (Admin Only)
* **Endpoint**: `POST /apartments`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: multipart/form-data`
* **Multipart Fields**:
  - `title` (string, required)
  - `price` (number, required)
  - `description` (string, optional)
  - `location` (string, optional)
  - `currency` (string, optional, ENUM: `USD`, `NGN`, default: `USD`)
  - `amenities` (comma-separated string or array, optional)
  - `apartment_type` (string, optional, e.g., "Executive Suite", "Penthouse", "Studio")
* **Multipart Files**:
  - `images`: Up to 6 image files
  - `videos`: Up to 2 video files
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Apartment created successfully!",
  "data": {
    "id": 2,
    "title": "Imperial Suite",
    "description": "Presidential suite of Seven Hills",
    "location": "Lekki, Lagos",
    "price": "250000",
    "currency": "USD",
    "status": "available",
    "amenities": "Pool,Wifi,Spa",
    "apartment_type": "Executive Suite",
    "images": "https://res.cloudinary.com/seven-hills/image/upload/.../img1.jpg",
    "videos": "https://res.cloudinary.com/seven-hills/video/upload/.../vid1.mp4"
  }
}
```

---

## 📅 Booking Services

### 1. Create Booking
* **Endpoint**: `POST /bookings`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
* **Request Body**:
```json
{
  "apartment_id": 1,
  "check_in": "2026-06-01",
  "check_out": "2026-06-05"
}
```
* **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Booking initialized successfully! Please proceed to payment.",
  "data": {
    "booking": {
      "id": 12,
      "user_id": "e30cb7b8-2a1f-44e2-9b2f-3f62916b9b3e",
      "apartment_id": 1,
      "check_in": "2026-06-01",
      "check_out": "2026-06-05",
      "total_price": "600000.00",
      "booking_status": "pending",
      "payment_status": "pending"
    },
    "apartment": {
      "title": "Royal Gold Suite",
      "location": "Abuja, Nigeria",
      "pricePerDay": "150000"
    },
    "days": 4
  }
}
```

### 2. Cancel Booking
* **Endpoint**: `PUT /bookings/:id/cancel`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully.",
  "data": {
    "id": 12,
    "booking_status": "cancelled"
  }
}
```

---

## 💳 Payment Integrations

### 1. Paystack - Initialize Payment
* **Endpoint**: `POST /payments/paystack/initialize`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
* **Request Body**:
```json
{
  "bookingId": 12
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Paystack payment initialized successfully.",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "reference": "PAY-8bf949...",
    "access_code": "0o12as..."
  }
}
```

### 2. Paystack - Verify Payment
* **Endpoint**: `GET /payments/paystack/verify?reference=PAY-8bf949...`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Payment verified successfully!",
  "booking_id": 12
}
```

### 3. Cryptocurrency - Initialize Payment
* **Endpoint**: `POST /payments/crypto/initialize`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
* **Request Body**:
```json
{
  "bookingId": 12,
  "coin": "USDT" // Supported: USDT, BTC, ETH
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Crypto payment initialized. Please transfer funds to the address provided below.",
  "data": {
    "bookingId": 12,
    "totalUSD": "400.00",
    "cryptoAmount": "400.00",
    "currency": "USDT",
    "walletAddress": "TX5d8t7fHkpqSm129hWJnB8bQvPtm182zL",
    "reference": "CRYPTO-USDT-9cf012a...",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?..."
  }
}
```

### 4. Cryptocurrency - Verify Blockchain Hash
* **Endpoint**: `POST /payments/crypto/verify`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
* **Request Body**:
```json
{
  "reference": "CRYPTO-USDT-9cf012a...",
  "txHash": "0x7a30cfb881ba920f01debb12... (standard 64/66 character transaction hash)"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Cryptocurrency payment confirmed! Your booking is now verified and active.",
  "data": {
    "reference": "CRYPTO-USDT-9cf012a...",
    "txHash": "0x7a30cfb881ba920f01debb12...",
    "confirmations": 12,
    "status": "success"
  }
}
```

---

## 🔔 App Notification Services

### 1. Get All Notifications
* **Endpoint**: `GET /notifications`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 14,
      "user_id": "e30cb7b8-2a1f-44e2-9b2f-3f62916b9b3e",
      "message": "Your booking for \"Royal Gold Suite\" has been initialized successfully.",
      "is_read": "false",
      "createdAt": "2026-05-27T01:25:30.000Z",
      "updatedAt": "2026-05-27T01:25:30.000Z"
    }
  ]
}
```

### 2. Mark All Notifications as Read
* **Endpoint**: `PUT /notifications/read-all`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```

### 3. Mark Single Notification as Read
* **Endpoint**: `PUT /notifications/:id/read`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Notification marked as read.",
  "data": {
    "id": 14,
    "user_id": "e30cb7b8-2a1f-44e2-9b2f-3f62916b9b3e",
    "message": "Your booking for \"Royal Gold Suite\" has been initialized successfully.",
    "is_read": "true",
    "createdAt": "2026-05-27T01:25:30.000Z",
    "updatedAt": "2026-05-27T01:28:10.000Z"
  }
}
```

---

## ⚙️ System Settings & Exchange Rate Control (Admin Only)

### 1. Get System Settings
* **Endpoint**: `GET /admin/settings`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "System settings retrieved successfully.",
  "data": {
    "usd_to_ngn_rate": 1650.00
  }
}
```

### 2. Update System Settings
* **Endpoint**: `PUT /admin/settings`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
* **Request Body**:
```json
{
  "usd_to_ngn_rate": 1650.00
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "System settings updated successfully.",
  "data": {
    "usd_to_ngn_rate": 1650.00
  }
}
```

---

## 🪙 Blockchain Wallet Operations (Admin Only)

### 1. Get Wallet Balance and Address
* **Endpoint**: `GET /wallet`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "wallet": {
    "address": "0xCeefE779Daa37D500531172ebcb228cc88d7759C",
    "balance": "4.250000"
  }
}
```

### 2. Recover Wallet Mnemonic Phrase
* **Endpoint**: `GET /wallet/mnemonic`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "wallet": {
    "address": "0xCeefE779Daa37D500531172ebcb228cc88d7759C",
    "mnemonic": "apple banana cherry ...",
    "private_key": "0xdecryptedprivatekey..."
  }
}
```

### 3. Send ETH Transfer
* **Endpoint**: `POST /wallet/transfer`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
* **Request Body**:
```json
{
  "toAddress": "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
  "amount": "1.25"
}
```
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Transfer successful!",
  "data": {
    "txHash": "0x894cdc18def3810fb378fd312f8f56763c185ff98753fd78fab49f6e111f997a",
    "from": "0xCeefE779Daa37D500531172ebcb228cc88d7759C",
    "to": "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    "amount": "1.250000 ETH",
    "newBalance": "4.250000 ETH",
    "confirmations": 1
  }
}
```

### 4. Get Wallet Transaction History
* **Endpoint**: `GET /wallet/history`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Transactions retrieved successfully!",
  "address": "0xCeefE779Daa37D500531172ebcb228cc88d7759C",
  "count": 1,
  "transactions": [
    {
      "hash": "0x894cdc18def3810fb378fd312f8f56763c185ff98753fd78fab49f6e111f997a",
      "blockNumber": "19283746",
      "timeStamp": "1716892530",
      "from": "0xCeefE779Daa37D500531172ebcb228cc88d7759C",
      "to": "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
      "value": "1250000000000000000",
      "formattedValue": "1.25 ETH",
      "confirmations": "120",
      "date": "2026-05-28T09:29:06.621Z"
    }
  ]
}
```

---

## 🔌 Socket.io Real-time Operations
Connect to `PORT:8300` (Socket connection must include JWT token in handshake auth or query):
```javascript
const socket = io("http://localhost:8300", {
  auth: { token: "YOUR_JWT_TOKEN" }
});
```

### 🔔 1. App Notifications
Upon successful connection, the client is automatically joined to their user room: `room_${userId}`.
* **Event**: `new_app_notification` (Received by client dynamically when actions occur)
* **Payload**:
```json
{
  "id": 5,
  "message": "Welcome to Seven Hills Suites! Your account has been verified successfully.",
  "is_read": "false",
  "createdAt": "2026-05-27T00:15:30.000Z"
}
```

### 💬 2. Support Chat
Allows live bidirectional chats between the user and active support/admin staff.
* **Join Chat**: Emitted by user or admin to register in the designated room.
  - User room is automatically `room_${userId}`.
* **Send Message Event**: `send_message` (Emitted by sender)
  - **Payload**:
  ```json
  {
    "receiverId": "SUPPORT_ADMIN_ID", // or USER_ID if sent by admin
    "message": "Hello, I have a question regarding my booking."
  }
  ```
* **Receive Message Event**: `receive_message` (Listened to by recipient)
  - **Payload**:
  ```json
  {
    "id": 102,
    "sender_id": "SENDER_UUID",
    "receiver_id": "RECEIVER_UUID",
    "message": "Hello, I have a question regarding my booking.",
    "createdAt": "2026-05-27T00:16:45.000Z"
  }
  ```
