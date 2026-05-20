import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Info } from 'lucide-react';
import type { Peer } from '../hooks/useNetwork';

interface SidebarProps {
  peers: Peer[];
  deviceName: string;
  onRename: (newName: string) => void;
  isConnected: boolean;
  onOpenSettings?: () => void;
}

export const Sidebar = ({ peers, deviceName, onRename, isConnected, onOpenSettings }: SidebarProps) => {
  const getDeviceIcon = (type: string, size = 20) => {
    switch (type) {
      case 'mobile': return <Smartphone className="text-gray-400" size={size} />;
      case 'tablet': return <Tablet className="text-gray-400" size={size} />;
      default: return <Monitor className="text-gray-400" size={size} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full md:w-64 lg:w-72 flex flex-col gap-4 shrink-0"
    >
      {/* Self Profile - Compact on mobile, standard on desktop */}
      <div className="glass-panel p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Monitor className="text-primary" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={deviceName}
              onChange={(e) => onRename(e.target.value)}
              className="bg-transparent text-white font-bold text-base md:text-lg w-full outline-none border-b border-transparent focus:border-primary/50 transition-colors truncate"
              placeholder="Your Name"
              title="Click to rename your device"
            />
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                <span className="text-[10px] md:text-xs text-textMuted font-semibold truncate">
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="text-[10px] text-primary hover:underline font-bold cursor-pointer shrink-0"
                >
                  Configure
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connected Peers - Horizontal list on mobile, vertical list on desktop */}
      <div className="glass-panel p-4 md:p-5 flex-1 flex flex-col min-h-0">
        <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-3 md:mb-4 flex items-center justify-between shrink-0">
          <span className="hidden md:inline">Nearby Devices</span>
          <span className="md:hidden">Devices Connected</span>
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] md:text-xs text-white font-bold">
            {peers.length}
          </span>
        </h3>

        {/* Scrollable container */}
        <div className="flex-1 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto pb-1 md:pb-0 pr-0 md:pr-1 scrollbar-thin">
          {peers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex md:flex-col items-center justify-center py-3 md:py-10 text-center gap-3 w-full"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 animate-pulse-slow">
                <Info className="text-gray-500" size={18} />
              </div>
              <p className="text-xxs md:text-xs text-textMuted max-w-[180px] leading-normal">
                No other devices in this room yet. Connect other devices using settings or QR code.
              </p>
            </motion.div>
          ) : (
            <div className="flex md:flex-col gap-2.5 min-w-max md:min-w-0">
              <AnimatePresence>
                {peers.map(peer => (
                  <motion.div 
                    key={peer.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-default shrink-0 md:shrink"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/5">
                      {getDeviceIcon(peer.deviceType, 16)}
                    </div>
                    <div className="min-w-[110px] md:min-w-0 md:flex-1">
                      <p className="text-xs md:text-sm font-semibold text-white truncate leading-snug">{peer.name}</p>
                      <p className="text-[10px] text-green-400 truncate flex items-center gap-1 mt-0.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block shadow-[0_0_6px_rgba(34,197,94,0.6)]"></span>
                        Active Sync
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
