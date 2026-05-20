# LANtext

**Instant Rich Text Sharing Across Your Local Network**

LANtext is a premium local-network text sharing web application inspired by Snapdrop and LocalSend — but focused entirely on ultra-fast rich text sharing between devices connected to the same network.

## Features

- **Local Network Discovery**: Automatically discover nearby devices on the same network.
- **Rich Text Sharing**: Support for headings, bold, italics, lists, and code blocks using TipTap.
- **Real-Time Sync**: Instant updates via WebRTC with Socket.IO fallback.
- **Multi-Device Rooms**: Connect multiple devices simultaneously.
- **QR Code Join**: Quickly connect mobile devices.
- **Offline & PWA Ready**: Installable as a progressive web app.

## Project Structure

- `/client` - React & Vite frontend with TailwindCSS, Framer Motion, and TipTap.
- `/server` - Express & Socket.IO backend for WebRTC signaling and text fallback relay.

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install
npm run start
```
The server will run on `http://localhost:3001`.

### 2. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

### 3. Environment Variables (Optional)

In `/client`, create a `.env` file:
```
VITE_SERVER_URL=http://localhost:3001
```

## Deployment

**Frontend**: Can be easily deployed to Vercel. 
**Backend**: Deploy to any Node.js hosting provider (Render, Railway, Heroku) that supports WebSockets. Make sure to set the `VITE_SERVER_URL` in your frontend build settings.

## Author

Created by Yasir Ispawoo
GitHub: [ispawoo](https://github.com/ispawoo)
Support: [Buy Me a Coffee](https://buymeacoffee.com/ispawoo)
