import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { UploadProgress } from './UploadProgress';

interface UploadOverlayProps {
  open: boolean;
  progress: number;
  status: string;
}

export function UploadOverlay({
  open,
  progress,
  status,
}: UploadOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              scale: .95,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: .95,
              opacity: 0,
            }}
            className="w-full max-w-md rounded-card bg-surface-container p-6 shadow-card-hover"
          >
            <div className="mb-5 flex items-center gap-3">
              <UploadCloud
                className="text-primary"
                size={26}
              />

              <div>
                <h2 className="text-title-md text-on-surface">
                 {status}
                </h2>

                <p className="text-label-sm text-metadata">
                  Please don't close this page.
                </p>
              </div>
            </div>

            <UploadProgress
              progress={progress}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}