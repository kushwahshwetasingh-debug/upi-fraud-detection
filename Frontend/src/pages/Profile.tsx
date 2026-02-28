import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { User, Mail, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    upi_id: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar username={userData.username} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto p-6 mt-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Header Card */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-4">
                {userData.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold capitalize">{userData.username}</h2>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">Verified User</p>
              
              <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-safe/10 text-safe rounded-full text-xs font-bold">
                <ShieldCheck className="w-3 h-3" />
                Security Level 1
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm h-full">
              <h3 className="text-lg font-bold mb-6">Profile Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium capitalize">{userData.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="font-medium">{userData.email || "Not Provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">UPI ID</p>
                    <p className="font-mono font-medium">{userData.upi_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{userData.phone || "Not Linked"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;