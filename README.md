---
title: LANtext Server
emoji: 📡
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---

# LANtext

**Instant Rich Text Sharing Across Your Local Network**

LANtext is a premium local-network text sharing web application — focused entirely on ultra-fast rich text sharing between devices on the same network or across the internet.

## Features

- **Instant Sync**: Automatically discover nearby devices and sync text in real-time.
- **Rich Text Sharing**: Support for headings, bold, italics, lists, and code blocks using TipTap.
- **Real-Time Sync**: Instant updates via WebRTC with Socket.IO fallback.
- **Multi-Device Rooms**: Connect multiple devices simultaneously.
- **QR Code Join**: Quickly connect mobile devices by scanning a QR code.
- **Works Everywhere**: Browser-based, no app install needed.

## Project Structure

- `/client` - React & Vite frontend with TailwindCSS, Framer Motion, and TipTap.
- `/server` - Express & Socket.IO backend for WebRTC signaling and text relay.
- `Dockerfile` - Docker config to deploy the server to Hugging Face Spaces.

## Deployment

**Frontend**: Deployed to [Vercel](https://vercel.com).  
**Backend (Signaling Server)**: Deployed to [Hugging Face Spaces](https://huggingface.co/spaces) via Docker — free, no credit card needed.

Set `VITE_SERVER_URL` in your Vercel environment variables to your HF Space URL (e.g. `https://ispawoo-lantext-server.hf.space`).

## Author

Created by Yasir Ispawoo  
GitHub: [ispawoo](https://github.com/ispawoo)  
Support: [Buy Me a Coffee](https://buymeacoffee.com/ispawoo)
