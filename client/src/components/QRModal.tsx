import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverUrl: string;
  roomId: string;
}

export const QRModal = ({ isOpen, onClose, serverUrl, roomId }: QRModalProps) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      const origin = window.location.origin + window.location.pathname;
      const connectUrl = `${origin}?room=${encodeURIComponent(roomId)}&server=${encodeURIComponent(serverUrl)}`;
      setUrl(connectUrl);
    }
  }, [isOpen, serverUrl, roomId]);

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
            className="glass-panel p-6 w-full max-w-sm relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <div className="text-center mb-6 mt-2">
              <h2 className="text-xl font-bold text-white mb-2">Connect Device</h2>
              <p className="text-sm text-textMuted">Scan this code with your phone's camera to join instantly.</p>
            </div>

            <div className="bg-white p-4 rounded-xl flex items-center justify-center mx-auto w-fit mb-6 shadow-xl">
              <QRCodeSVG 
                value={url} 
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center">
              <p className="text-xs text-textMuted truncate">{url}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
