import { Shield, ChevronDown, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  username: string;
  onLogout: () => void;
}

const Navbar = ({ username, onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const initials = username.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center glow-primary">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-gradient-primary">Fraud</span>
          <span className="text-foreground"> Upi</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 ml-2 pl-3 pr-2.5 py-2 rounded-2xl bg-secondary hover:bg-accent transition-colors border border-transparent hover:border-border outline-none">
            <div className="w-7 h-7 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary font-mono">
              {initials || "U"}
            </div>
            <span className="text-sm font-medium text-foreground capitalize">
              {username}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 mt-2 rounded-2xl border-border bg-card p-2 shadow-xl" align="end">
            {/* Profile Details Option */}
            <DropdownMenuItem 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-secondary focus:bg-secondary outline-none"
            >
              <User className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Profile Details</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">View Account</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-border" />

            {/* Logout Option */}
            <DropdownMenuItem 
              onClick={onLogout}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-destructive/10 text-destructive focus:bg-destructive/10 outline-none"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-bold">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;