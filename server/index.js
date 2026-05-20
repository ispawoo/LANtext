const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  },
  transports: ['websocket', 'polling']
});

// Store connected clients grouped by their IP (LAN)
const rooms = new Map();
// Structure:
// rooms = Map<ip, Map<socketId, { id, name, deviceType }>>

function getClientIp(socket) {
  // In production (Vercel/Render etc), usually x-forwarded-for holds the real IP
  const forwarded = socket.handshake.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  // Fallback to connection remote address (for local testing)
  return socket.request.connection.remoteAddress || 'unknown';
}

io.on('connection', (socket) => {
  const ip = getClientIp(socket);
  
  socket.on('join', (deviceInfo) => {
    // deviceInfo: { name: 'Yasir-PC', deviceType: 'desktop', roomId }
    const roomName = deviceInfo.roomId || ip;
    socket.roomName = roomName;
    
    // Join a room specific to the roomId or public IP
    socket.join(roomName);
    
    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Map());
    }
    
    const roomClients = rooms.get(roomName);
    // IMPORTANT: spread deviceInfo first, then override id with socket.id
    // so that (1) self-filter works and (2) WebRTC signaling routes correctly
    const peerInfo = { ...deviceInfo, id: socket.id };
    roomClients.set(socket.id, peerInfo);
    
    // Send list of existing peers to the new client (exclude self by socket.id key)
    const existingPeers = Array.from(roomClients.entries())
      .filter(([key]) => key !== socket.id)
      .map(([, value]) => value);
    socket.emit('room_peers', existingPeers);
    
    // Notify others in the room
    socket.to(roomName).emit('peer_joined', peerInfo);
    
    console.log(`[${roomName}] Client ${socket.id} (${deviceInfo.name}) joined.`);
  });
  
  // WebRTC Signaling
  socket.on('signal', (data) => {
    // data: { to: peerId, signal: signalData }
    io.to(data.to).emit('signal', {
      from: socket.id,
      signal: data.signal
    });
  });
  
  // Fallback Text Relay via Socket.io
  socket.on('relay_text', (data) => {
    const roomName = socket.roomName || ip;
    // broadcast to room
    socket.to(roomName).emit('text_received', {
      from: socket.id,
      content: data.content
    });
  });

  socket.on('disconnect', () => {
    const roomName = socket.roomName || ip;
    const roomClients = rooms.get(roomName);
    if (roomClients) {
      roomClients.delete(socket.id);
      if (roomClients.size === 0) {
        rooms.delete(roomName);
      } else {
        socket.to(roomName).emit('peer_left', socket.id);
      }
    }
    console.log(`[${roomName}] Client ${socket.id} disconnected.`);
  });
});

const PORT = process.env.PORT || 3001;

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('LANtext Signaling Server is running.');
});

server.listen(PORT, () => {
  console.log(`LANtext Backend running on port ${PORT}`);
});
