import { useState, useCallback } from 'react';
import { useNetwork } from './hooks/useNetwork';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { QRModal } from './components/QRModal';
import { SettingsModal } from './components/SettingsModal';
import { Copy, CheckCheck, Zap, Globe, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [content, setContent] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showApp, setShowApp] = useState(false);

  const [roomId, setRoomId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRoom = urlParams.get('room');
    if (urlRoom) {
      localStorage.setItem('roomId', urlRoom);
      return urlRoom;
    }
    const storedRoom = localStorage.getItem('roomId');
    if (storedRoom) return storedRoom;
    const newRoom = `room-${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem('roomId', newRoom);
    return newRoom;
  });

  const [serverUrl, setServerUrl] = useState(() => {
    // 1. URL param always wins (from QR code scan)
    const urlParams = new URLSearchParams(window.location.search);
    const urlServer = urlParams.get('server');
    if (urlServer) {
      localStorage.setItem('serverUrl', urlServer);
      return urlServer;
    }

    const storedServer = localStorage.getItem('serverUrl');

    // 2. If on HTTPS (Vercel / internet), always use the cloud signaling server
    if (window.location.protocol === 'https:') {
      const cloudServer = import.meta.env.VITE_SERVER_URL || '';
      // Ignore any stored local http:// URL — it can't work from HTTPS
      if (storedServer && storedServer.startsWith('https://')) return storedServer;
      return cloudServer;
    }

    // 3. On HTTP (local dev / LAN) — use stored or auto-detect local IP
    if (storedServer && storedServer.startsWith('http://')) return storedServer;

    // Auto-detect: use the hostname the app was opened from
    const h = window.location.hostname;
    if (h !== 'localhost' && h !== '127.0.0.1') {
      return `http://${h}:3001`;
    }
    return 'http://localhost:3001';
  });

  const handleTextReceived = useCallback((text: string) => {
    setContent(text);
  }, []);

  const {
    isConnected,
    peers,
    broadcastText,
    deviceName,
    setDeviceName
  } = useNetwork(serverUrl, roomId, handleTextReceived);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    broadcastText(newContent);
  };

  const handleSaveServerUrl = (url: string) => {
    setServerUrl(url);
    localStorage.setItem('serverUrl', url);
  };

  const handleSaveRoomId = (id: string) => {
    setRoomId(id);
    localStorage.setItem('roomId', id);
  };

  const copyToClipboard = async () => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!showApp) {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto items-center justify-center text-center relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center max-w-3xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-8">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 14L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
            LANtext
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl font-light">
            Instant Rich Text Sharing Across Your Local Network. <br className="hidden md:block"/> No login. No cloud limits. Just pure speed.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <button 
              onClick={() => setShowApp(true)}
              className="glass-button-primary px-8 py-4 text-lg w-full sm:w-auto"
            >
              Open App <ChevronRight size={20} />
            </button>
            <a 
              href="https://github.com/ispawoo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-button px-8 py-4 text-lg w-full sm:w-auto text-gray-300"
            >
              GitHub
            </a>
            <a 
              href="https://buymeacoffee.com/ispawoo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-button bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 px-8 py-4 text-lg w-full sm:w-auto"
            >
              Buy Me a Coffee
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 text-left border-white/5">
              <Zap className="text-primary mb-4" size={28} />
              <h3 className="text-lg font-semibold text-white mb-2">Instant Sync</h3>
              <p className="text-sm text-gray-400">WebRTC powered peer-to-peer connection ensures zero-latency text updates.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 text-left border-white/5">
              <Lock className="text-primary mb-4" size={28} />
              <h3 className="text-lg font-semibold text-white mb-2">Local Only</h3>
              <p className="text-sm text-gray-400">Your text stays on your network. No cloud storage, complete privacy.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 text-left border-white/5">
              <Globe className="text-primary mb-4" size={28} />
              <h3 className="text-lg font-semibold text-white mb-2">Cross-Device</h3>
              <p className="text-sm text-gray-400">Works perfectly across iPhone, Android, Mac, and Windows simultaneously.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <Header 
        onOpenQR={() => setIsQRModalOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setShowApp(false)}
      />


      
      <main className="flex-1 flex flex-col md:flex-row gap-6 lg:gap-8 min-h-0 h-auto md:h-[calc(100vh-140px)] pb-6 md:pb-12">
        <Sidebar 
          peers={peers} 
          deviceName={deviceName} 
          onRename={setDeviceName}
          isConnected={isConnected}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex-1 flex flex-col gap-4 relative z-10 min-h-[500px]"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-white/90">Shared Workspace</h2>
            <button 
              onClick={copyToClipboard}
              className="glass-button px-4 py-2 text-sm"
            >
              {copied ? <CheckCheck size={16} className="text-green-400" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy All'}
            </button>
          </div>
          
          <Editor 
            content={content} 
            onChange={handleContentChange} 
          />
        </motion.div>
      </main>

      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        serverUrl={serverUrl}
        roomId={roomId}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        deviceName={deviceName}
        onRename={setDeviceName}
        serverUrl={serverUrl}
        onSaveServerUrl={handleSaveServerUrl}
        roomId={roomId}
        onSaveRoomId={handleSaveRoomId}
        isConnected={isConnected}
      />

      <footer className="fixed bottom-4 right-8 text-xs text-textMuted flex flex-col items-end gap-1">
        <p>Created by Yasir Ispawoo</p>
        <a 
          href="https://github.com/ispawoo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          github.com/ispawoo
        </a>
      </footer>
    </div>
  )
}

export default App;
