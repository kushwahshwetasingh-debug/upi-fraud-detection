import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form States - includes all fields required by your FastAPI UserCreate model
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    upi_id: "",
    phone: "",
    reg_date: new Date().toISOString().split('T')[0] 
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // The backend expects different structures for login vs registration
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin 
      ? { username: formData.username, password: formData.password } 
      : formData;

    try {
      const response = await axios.post(endpoint, payload);
      
      if (isLogin) {
        // Only navigate if the token exists to prevent the black screen
        if (response.data && response.data.access_token) {
          localStorage.setItem("token", response.data.access_token);
          toast.success("Authentication successful!");
          navigate("/dashboard");
        } else {
          throw new Error("Token not received from server");
        }
      } else {
        toast.success("Account created! You can now login.");
        setIsLogin(true); 
      }
    } catch (error: any) {
      // Specifically capture backend validation errors
      const errorMsg = error.response?.data?.detail || "Connection failed. Is the backend running?";
      toast.error(errorMsg);
      console.error("Auth Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-display">
      <Card className="w-full max-w-md border-border bg-card shadow-2xl glow-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary tracking-tight">Fraud Upi</CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin ? "Enter credentials to access dashboard" : "Register a new secure identity"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                placeholder="e.g. xyz_user"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required 
                className="bg-secondary/50 border-border"
              />
            </div>
            
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com"
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input 
                      id="upi"
                      placeholder="user@upi" 
                      value={formData.upi_id} 
                      onChange={(e) => setFormData({...formData, upi_id: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      placeholder="10-digit number" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Simulation Date</Label>
                  <Input 
                    id="date"
                    type="date" 
                    value={formData.reg_date} 
                    onChange={(e) => setFormData({...formData, reg_date: e.target.value})} 
                    required 
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
                className="bg-secondary/50 border-border"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full font-bold h-11" type="submit" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Authorize Login" : "Create Account"}
            </Button>
            <Button 
              variant="ghost" 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {isLogin ? "Need a new account? Register here" : "Return to secure login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;