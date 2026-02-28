import { ShieldAlert, ShieldX, X, AlertTriangle } from 'lucide-react';

interface SafeToastProps {
  score: number;
  onClose: () => void;
}

export const SafeToast = ({ score, onClose }: SafeToastProps) => (
  <div className="fixed bottom-6 right-6 z-50 zoom-in">
    <div className="flex items-center gap-3 rounded-2xl bg-safe/15 border border-safe/30 px-5 py-4 glow-safe backdrop-blur-sm">
      <div className="w-8 h-8 rounded-xl bg-safe/20 flex items-center justify-center">
        <ShieldAlert className="w-4 h-4 text-safe" />
      </div>
      <div>
        <p className="text-sm font-semibold text-safe">Transaction Approved</p>
        <p className="text-xs text-safe/70 font-mono">Risk Score: {score} | Status: Safe</p>
      </div>
      <button onClick={onClose} className="ml-3 p-1 rounded-lg hover:bg-safe/10 transition-colors">
        <X className="w-4 h-4 text-safe/60" />
      </button>
    </div>
  </div>
);

interface MediumBannerProps {
  score: number;
  onClose: () => void;
}

export const MediumBanner = ({ score, onClose }: MediumBannerProps) => (
  <div className="w-full zoom-in">
    <div className="flex items-center gap-3 rounded-2xl bg-warning/10 border border-warning/25 px-5 py-4">
      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-warning">Suspicious Transaction Detected</p>
        <p className="text-xs text-warning/70 font-mono">Additional Verification Required | Risk Score: {score}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-warning/10 transition-colors">
        <X className="w-4 h-4 text-warning/60" />
      </button>
    </div>
  </div>
);

interface HighModalProps {
  score: number;
  onClose: () => void;
}

export const HighModal = ({ score, onClose }: HighModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center fade-in">
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
    <div className="relative rounded-3xl bg-card border border-danger/30 p-8 max-w-md w-full mx-4 zoom-in glow-danger">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-danger/15 flex items-center justify-center mb-5">
          <ShieldAlert className="w-8 h-8 text-danger" />
        </div>
        <h3 className="text-lg font-bold text-danger mb-1">Transaction Blocked</h3>
        <p className="text-sm text-danger/80 mb-1">Fraud Detected</p>
        <p className="text-2xl font-mono font-bold text-danger mb-5">Risk Score: {score}</p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-2xl bg-danger/15 border border-danger/30 text-sm font-semibold text-danger hover:bg-danger/25 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
);

interface BlockedOverlayProps {
  score: number;
  onClose: () => void;
}

export const BlockedOverlay = ({ score, onClose }: BlockedOverlayProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center fade-in" style={{ background: 'hsl(0, 30%, 8%)' }}>
    <div className="flex flex-col items-center text-center p-8 max-w-lg zoom-in">
      <div className="w-20 h-20 rounded-3xl bg-danger/20 flex items-center justify-center mb-6 glow-danger">
        <ShieldX className="w-10 h-10 text-danger" />
      </div>
      <h2 className="text-2xl font-bold text-danger mb-2">High Risk Pattern Detected</h2>
      <p className="text-base text-danger/70 mb-2">Night Transaction + Large Amount</p>
      <p className="text-sm text-danger/50 mb-4 font-mono">Fraud Probability High | Score: {score}</p>
      <div className="w-full h-px bg-danger/20 my-4" />
      <button
        onClick={onClose}
        className="px-8 py-3 rounded-2xl bg-danger text-danger-foreground font-semibold text-sm hover:opacity-90 transition-all"
      >
        Acknowledge & Close
      </button>
    </div>
  </div>
);
