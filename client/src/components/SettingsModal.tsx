import { X, Server, Key, Monitor, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
  onRename: (newName: string) => void;
  serverUrl: string;
  onSaveServerUrl: (url: string) => void;
  roomId: string;
  onSaveRoomId: (id: string) => void;
  isConnected: boolean;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  deviceName,
  onRename,
  serverUrl,
  onSaveServerUrl,
  roomId,
  onSaveRoomId,
  isConnected,
}: SettingsModalProps) => {
  const [localServerUrl, setLocalServerUrl] = useState(serverUrl);
  const [localRoomId, setLocalRoomId] = useState(roomId);

  useEffect(() => {
    setLocalServerUrl(serverUrl);
  }, [serverUrl, isOpen]);

  useEffect(() => {
    setLocalRoomId(roomId);
  }, [roomId, isOpen]);

  const handleSave = () => {
    onSaveServerUrl(localServerUrl.trim());
    onSaveRoomId(localRoomId.trim());
    onClose();
  };

  const resetToDefault = () => {
    let defaultUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    if (window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.') || window.location.hostname.startsWith('172.')) {
      defaultUrl = `http://${window.location.hostname}:3001`;
    }
    setLocalServerUrl(defaultUrl);
  };

  const generateNewRoomId = () => {
    const newRoom = `room-${Math.floor(100000 + Math.random() * 900000)}`;
    setLocalRoomId(newRoom);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-panel p-6 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <div className="text-center mb-6 mt-2">
              <h2 className="text-xl font-bold text-white mb-1">Configuration & Settings</h2>
              <p className="text-sm text-textMuted">Tailor your LANtext sync preferences.</p>
            </div>

            <div className="space-y-5">
              {/* Connection Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isConnected 
                  ? 'bg-green-500/10 border-green-500/25 text-green-400' 
                  : 'bg-red-500/10 border-red-500/25 text-red-400'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">
                    Status: {isConnected ? 'Online & Syncing' : 'Disconnected'}
                  </span>
                </div>
                <span className="text-xs opacity-75">
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>

              {/* Device Name Setting */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                  <Monitor size={14} /> Device Display Name
                </label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => onRename(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary/50 transition-colors text-sm w-full"
                  placeholder="Your Name"
                />
              </div>

              {/* Signaling Server Setting */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                    <Server size={14} /> Signaling Server URL
                  </label>
                  <button 
                    onClick={resetToDefault}
                    className="text-xs text-primary hover:underline"
                  >
                    Set Default
                  </button>
                </div>
                <input
                  type="text"
                  value={localServerUrl}
                  onChange={(e) => setLocalServerUrl(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary/50 transition-colors text-sm w-full font-mono"
                  placeholder="http://192.168.x.x:3001"
                />
                <p className="text-xxs text-textMuted">
                  Point this to your computer's local IP (e.g. <code>http://192.168.1.100:3001</code>) if testing with devices on the same Wi-Fi.
                </p>
              </div>

              {/* Room ID Setting */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
                    <Key size={14} /> Sync Room ID
                  </label>
                  <button 
                    onClick={generateNewRoomId}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  value={localRoomId}
                  onChange={(e) => setLocalRoomId(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-primary/50 transition-colors text-sm w-full font-mono"
                  placeholder="custom-room-id"
                />
                <p className="text-xxs text-textMuted">
                  Devices sharing the same Room ID on the same server will automatically sync clipboard/text changes.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button 
                onClick={onClose}
                className="glass-button flex-1 py-3 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="glass-button-primary flex-1 py-3 text-sm font-semibold"
              >
                Save & Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
