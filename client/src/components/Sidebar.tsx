import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import type { Peer } from '../hooks/useNetwork';

interface SidebarProps {
  peers: Peer[];
  deviceName: string;
  onRename: (newName: string) => void;
  isConnected: boolean;
  onOpenSettings?: () => void;
}

export const Sidebar = ({ peers, deviceName, onRename, isConnected, onOpenSettings }: SidebarProps) => {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="text-gray-400" size={20} />;
      case 'tablet': return <Tablet className="text-gray-400" size={20} />;
      default: return <Monitor className="text-gray-400" size={20} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full md:w-64 lg:w-72 flex flex-col gap-4"
    >
      {/* Self Profile */}
      <div className="glass-panel p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <Monitor className="text-primary" size={20} />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={deviceName}
              onChange={(e) => onRename(e.target.value)}
              className="bg-transparent text-white font-semibold text-lg w-full outline-none border-b border-transparent focus:border-primary/50 transition-colors"
              placeholder="Your Name"
            />
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                <span className="text-xs text-textMuted font-medium">
                  {isConnected ? 'Connected to Room' : 'Disconnected'}
                </span>
              </div>
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="text-xxs text-primary hover:underline self-start font-medium cursor-pointer"
                >
                  Configure Server
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connected Peers */}
      <div className="glass-panel p-5 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-4 flex items-center justify-between">
          Nearby Devices
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-white">
            {peers.length}
          </span>
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {peers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-32 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 animate-pulse-slow">
                <Monitor className="text-gray-500" size={24} />
              </div>
              <p className="text-sm text-textMuted">Waiting for devices on this network...</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {peers.map(peer => (
                <motion.div 
                  key={peer.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 cursor-default"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    {getDeviceIcon(peer.deviceType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{peer.name}</p>
                    <p className="text-xs text-green-400 truncate flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                      Online
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};
