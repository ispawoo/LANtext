import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';


export type Peer = {
  id: string;
  name: string;
  deviceType: string;
};

export const useNetwork = (
  serverUrl: string,
  roomId: string,
  onTextReceived: (text: string) => void
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [deviceId] = useState(() => localStorage.getItem('deviceId') || uuidv4());
  const [deviceName, setDeviceName] = useState(() => localStorage.getItem('deviceName') || `Device-${Math.floor(Math.random() * 1000)}`);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // WebRTC peer connections: Map<socketId, RTCPeerConnection>
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  // WebRTC data channels: Map<socketId, RTCDataChannel>
  const dataChannels = useRef<Map<string, RTCDataChannel>>(new Map());

  useEffect(() => {
    localStorage.setItem('deviceId', deviceId);
    localStorage.setItem('deviceName', deviceName);
  }, [deviceId, deviceName]);

  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
      return 'desktop';
    };

    newSocket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
      newSocket.emit('join', {
        id: deviceId,
        name: deviceName,
        deviceType: getDeviceType(),
        roomId: roomId,
      });
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
      setConnectionError(err.message || 'Failed to connect');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setPeers([]);
      setConnectionError('Disconnected');
    });

    newSocket.on('room_peers', (existingPeers: Peer[]) => {
      setPeers(existingPeers);
      // Initiate WebRTC connection to existing peers
      existingPeers.forEach(peer => {
        createPeerConnection(peer.id, newSocket, true);
      });
    });

    newSocket.on('peer_joined', (peer: Peer) => {
      setPeers(prev => [...prev.filter(p => p.id !== peer.id), peer]);
      // The new peer will receive the offer, so we don't initiate here.
      // Wait, standard mesh: existing peers should create offer OR new peer creates offer.
      // Let's have the existing peers create the offer.
      createPeerConnection(peer.id, newSocket, true);
    });

    newSocket.on('peer_left', (peerId: string) => {
      setPeers(prev => prev.filter(p => p.id !== peerId));
      if (peerConnections.current.has(peerId)) {
        peerConnections.current.get(peerId)?.close();
        peerConnections.current.delete(peerId);
      }
      if (dataChannels.current.has(peerId)) {
        dataChannels.current.delete(peerId);
      }
    });

    newSocket.on('signal', async (data: { from: string, signal: any }) => {
      const { from, signal } = data;
      
      let pc = peerConnections.current.get(from);
      if (!pc) {
        pc = createPeerConnection(from, newSocket, false);
      }

      try {
        if (signal.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          newSocket.emit('signal', { to: from, signal: answer });
        } else if (signal.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
        } else if (signal.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(signal));
        }
      } catch (err) {
        console.error('WebRTC Signaling Error:', err);
      }
    });

    // Fallback: Text relay via Socket.IO
    newSocket.on('text_received', (data: { from: string, content: string }) => {
      onTextReceived(data.content);
    });

    return () => {
      newSocket.disconnect();
      peerConnections.current.forEach(pc => pc.close());
      peerConnections.current.clear();
      dataChannels.current.clear();
    };
  }, [deviceId, deviceName, serverUrl, roomId]);

  const createPeerConnection = (peerId: string, socketInstance: Socket, isInitiator: boolean) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });

    peerConnections.current.set(peerId, pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketInstance.emit('signal', {
          to: peerId,
          signal: event.candidate,
        });
      }
    };

    if (isInitiator) {
      const dc = pc.createDataChannel('text-sync');
      setupDataChannel(dc, peerId);
      dataChannels.current.set(peerId, dc);

      pc.createOffer().then(offer => {
        return pc.setLocalDescription(offer);
      }).then(() => {
        socketInstance.emit('signal', {
          to: peerId,
          signal: pc.localDescription,
        });
      }).catch(err => console.error(err));
    } else {
      pc.ondatachannel = (event) => {
        const dc = event.channel;
        setupDataChannel(dc, peerId);
        dataChannels.current.set(peerId, dc);
      };
    }

    return pc;
  };

  const setupDataChannel = (dc: RTCDataChannel, peerId: string) => {
    dc.onmessage = (event) => {
      // Received text via WebRTC
      onTextReceived(event.data);
    };
    dc.onopen = () => console.log(`DataChannel open with ${peerId}`);
    dc.onclose = () => console.log(`DataChannel closed with ${peerId}`);
  };

  const broadcastText = (text: string) => {
    let sentViaWebRTC = false;
    
    // Try sending via WebRTC first
    dataChannels.current.forEach((dc) => {
      if (dc.readyState === 'open') {
        dc.send(text);
        sentViaWebRTC = true;
      }
    });

    // Fallback or broadcast to those without WebRTC
    // If we have some peers without open data channels, we use socket.io as fallback
    // For simplicity, if ANY WebRTC channel isn't open (or we have no channels but have peers), fallback.
    const expectedChannels = peers.length;
    let openChannels = 0;
    dataChannels.current.forEach(dc => { if (dc.readyState === 'open') openChannels++ });

    if (openChannels < expectedChannels || peers.length > 0 && !sentViaWebRTC) {
      socket?.emit('relay_text', { content: text });
    }
  };

  return {
    isConnected,
    connectionError,
    peers,
    broadcastText,
    deviceName,
    setDeviceName
  };
};
