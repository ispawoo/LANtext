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
    const urlParams = new URLSearchParams(window.location.search);
    const urlServer = urlParams.get('server');
    if (urlServer) {
      localStorage.setItem('serverUrl', urlServer);
      return urlServer;
    }
    const storedServer = localStorage.getItem('serverUrl');
    if (storedServer) return storedServer;
    
    // Auto-detect local network IP port 3001
    if (window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.') || window.location.hostname.startsWith('172.')) {
      return `http://${window.location.hostname}:3001`;
    }
    return import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
  });

  const handleTextReceived = useCallback((text: string) => {
    setContent(text);
  }, []);

  const {
    isConnected,
    connectionError,
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

  const isMixedContentError = window.location.protocol === 'https:' && serverUrl.startsWith('http://');

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <Header 
        onOpenQR={() => setIsQRModalOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setShowApp(false)}
      />

      {/* Security & Connection Warnings */}
      {(isMixedContentError || (connectionError && !isConnected)) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex flex-col gap-2 relative overflow-hidden backdrop-blur-md shadow-lg"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">
                {isMixedContentError ? 'Browser Security Warning (Mixed Content)' : 'Signaling Server Disconnected'}
              </h3>
              <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
                {isMixedContentError ? (
                  <>
                    You are accessing LANtext over secure <strong>HTTPS</strong>, but your signaling server is set to an insecure <strong>HTTP</strong> address (<code>{serverUrl}</code>). Modern web browsers block secure websites from connecting to insecure local services.
                  </>
                ) : (
                  <>
                    Could not establish a connection to your signaling server at <code>{serverUrl}</code>. Make sure your server is running and accessible on your local network.
                  </>
                )}
              </p>
              
              <div className="mt-4 p-4 rounded-xl bg-black/35 border border-white/5 flex flex-col gap-2 text-xs">
                <span className="font-bold text-white uppercase tracking-wider text-xxs">How to solve this in 10 seconds:</span>
                <ul className="list-disc pl-4 space-y-1.5 text-gray-300">
                  <li>
                    <strong>Run the app locally:</strong> Open the app on your computer using the local HTTP URL <code>http://localhost:5173</code> (or your computer's local IP, e.g. <code>http://192.168.x.x:5173</code>) instead of Vercel. Both devices will connect cleanly without security blocks.
                  </li>
                  <li>
                    <strong>Use Secure Protocol:</strong> If your backend is deployed, ensure the signaling server URL starts with <code>https://</code> or <code>wss://</code> (e.g. <code>https://your-backend.onrender.com</code>).
                  </li>
                  <li>
                    <strong>Configure Settings:</strong> Click the <button onClick={() => setIsSettingsOpen(true)} className="text-primary hover:underline font-bold focus:outline-none cursor-pointer">Configure Server</button> button to update your settings.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
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
