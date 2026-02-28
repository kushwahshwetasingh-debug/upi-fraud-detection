import { Shield, Fingerprint, Wifi, CheckCircle2 } from 'lucide-react';

// Define what data this card needs to receive
interface UserCardProps {
  expanded?: boolean;
  username: string;
  upiId: string;
}

const UserCard = ({ expanded, username, upiId }: UserCardProps) => {
  // Logic to get initials (e.g., "Achal Singhal" -> "AS")
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-3xl bg-card border border-border p-6 animate-in h-full transition-all hover:shadow-lg hover:shadow-primary/5">
      {/* Avatar & Identity */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center glow-primary">
          <span className="text-lg font-bold text-primary font-mono">
            {initials || "U"} 
          </span>
        </div>
        <div>
          {/* Displaying real username from backend */}
          <h3 className="text-base font-semibold text-foreground capitalize">
            {username}
          </h3>
          <p className="text-sm text-muted-foreground">User Identity</p>
        </div>
      </div>

      {/* UPI ID */}
      <div className="rounded-2xl bg-secondary/70 p-4 mb-4 border border-border/50">
        <div className="flex items-center gap-2 mb-1">
          <Fingerprint className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">UPI Handle</span>
        </div>
        {/* Displaying real UPI ID */}
        <p className="text-sm font-mono font-semibold text-foreground">
          {upiId}
        </p>
      </div>

      {/* ML Status */}
      <div className="rounded-2xl bg-safe/10 border border-safe/20 p-4 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-safe" />
          <span className="text-xs font-medium text-safe uppercase tracking-wider">ML Status</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <CheckCircle2 className="w-4 h-4 text-safe" />
          <span className="text-sm font-semibold text-safe">Protected</span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2 text-muted-foreground pt-2">
        <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
        <Wifi className="w-3.5 h-3.5" />
        <span className="text-xs">Secure connection active</span>
      </div>
    </div>
  );
};

export default UserCard;