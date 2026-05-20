import { QrCode, Heart, Home, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onOpenQR: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
}

export const Header = ({ onOpenQR, onOpenSettings, onGoHome }: HeaderProps) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between py-4 mb-6"
    >
      <div 
        onClick={onGoHome}
        className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 14L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">LANtext</h1>
          <p className="text-xs text-textMuted tracking-wider uppercase font-medium">Instant LAN Sync</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onGoHome}
          className="glass-button w-10 h-10 rounded-full"
          title="Back to Landing Page"
        >
          <Home size={18} className="text-gray-300" />
        </button>
        <button 
          onClick={onOpenQR}
          className="glass-button w-10 h-10 rounded-full"
          title="Connect via QR"
        >
          <QrCode size={18} className="text-gray-300" />
        </button>
        <button 
          onClick={onOpenSettings}
          className="glass-button w-10 h-10 rounded-full"
          title="Server Settings"
        >
          <Settings size={18} className="text-gray-300" />
        </button>
        <a 
          href="https://github.com/ispawoo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass-button w-10 h-10 rounded-full hidden sm:flex"
          title="GitHub"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </a>
        <a 
          href="https://buymeacoffee.com/ispawoo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass-button bg-white/10 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-rose-400 w-10 h-10 rounded-full group"
          title="Buy Me a Coffee"
        >
          <Heart size={18} className="text-gray-300 group-hover:text-rose-400 transition-colors" />
        </a>
      </div>
    </motion.header>
  );
};
