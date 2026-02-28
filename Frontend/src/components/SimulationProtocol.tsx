import { useState } from 'react';
import { IndianRupee, Sun, Moon, Zap, Loader2 } from 'lucide-react';

interface SimulationProtocolProps {
  onCheckRisk: (amount: number, isNight: number) => void;
  loading: boolean;
}

const SimulationProtocol = ({ onCheckRisk, loading }: SimulationProtocolProps) => {
  const [amount, setAmount] = useState('');
  const [isNight, setIsNight] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    onCheckRisk(parsedAmount, isNight);
  };

  return (
    <div className="rounded-3xl bg-card border border-border p-6 animate-in h-full">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">Simulation Protocol</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount Input */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Transaction Amount
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="1"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-secondary border border-border text-foreground font-mono text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Time Toggle */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Time Period
          </label>
          <div className="flex rounded-2xl bg-secondary border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setIsNight(0)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
                isNight === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun className="w-4 h-4" />
              Day
            </button>
            <button
              type="button"
              onClick={() => setIsNight(1)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
                isNight === 1
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon className="w-4 h-4" />
              Night
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-primary"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {loading ? 'Analyzing...' : 'Check Risk'}
        </button>
      </form>
    </div>
  );
};

export default SimulationProtocol;
