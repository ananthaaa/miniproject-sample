
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, ChevronRight } from 'lucide-react';

interface ArrivalModalProps {
  destinationName: string;
  onDismiss: () => void;
}

export function ArrivalModal({ destinationName, onDismiss }: ArrivalModalProps) {
  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 380,
          borderRadius: 28,
          overflow: 'hidden',
          background: 'var(--bg-secondary, #fff)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Green header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '32px 28px 24px',
          textAlign: 'center',
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            style={{
              width: 72, height: 72,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle size={40} color="white" />
          </motion.div>
          <h2 style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 800,
            margin: '0 0 6px',
            letterSpacing: '-0.3px',
          }}>
            Destination Reached!
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <MapPin size={14} color="rgba(255,255,255,0.8)" />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 }}>
              {destinationName}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px 28px' }}>
          <p style={{
            color: 'var(--text-secondary, #64748b)',
            fontSize: 14,
            lineHeight: 1.6,
            margin: '0 0 8px',
            textAlign: 'center',
          }}>
            You have reached <strong style={{ color: 'var(--text-primary, #0a1628)' }}>{destinationName}</strong>.
          </p>
          <p style={{
            color: 'var(--text-secondary, #64748b)',
            fontSize: 13,
            lineHeight: 1.6,
            margin: '0 0 24px',
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            Indoor directions will be available in the next version.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDismiss}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 14,
              padding: '14px 24px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
            }}
          >
            Done
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
