import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import UserCard from '@/components/UserCard';
import SimulationProtocol from '@/components/SimulationProtocol';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { SafeToast, MediumBanner, HighModal, BlockedOverlay } from '@/components/RiskModals';
import { toast } from 'sonner';

/**
 * RiskResult Type defined to match the 4 UI cases in documentation [cite: 26, 70]
 * Safe, Medium, High, and Blocked (Night Pattern)
 */
type RiskResult =
  | { type: 'safe'; score: number; reasons: string[] }
  | { type: 'medium'; score: number; reasons: string[] }
  | { type: 'high'; score: number; reasons: string[] }
  | { type: 'blocked'; score: number; reasons: string[] }
  | null;

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [riskResult, setRiskResult] = useState<RiskResult>(null);
  
  // State for real user data including email to ensure Navbar initial rendering
  const [userData, setUserData] = useState({ 
    username: "Loading...", 
    upi_id: "...",
    email: "", 
    phone: ""
  });

  // 1. Fetch real user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); 
          return;
        }

        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Profile fetch failed:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    fetchProfile();
  }, [navigate]);

  // 2. Logout function
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    toast.success("Session Terminated");
    navigate("/");
  }, [navigate]);

  /**
   * 3. Risk Check logic - Driven by Backend 'risk_level' [cite: 17, 69]
   * Communicates with POST /predict-fraud as per architecture [cite: 19, 45, 66]
   */
  const handleCheckRisk = useCallback(async (amount: number, isNight: number) => {
    setLoading(true);
    setRiskResult(null);

    try {
      const token = localStorage.getItem("token");
      
      // Request payload follows documented structure [cite: 43, 50]
      const response = await axios.post('/api/predict', 
        { 
          amount, 
          is_night: isNight === 1,
          receiver_upi: "simulation@upi", 
          receiver_name: "Simulation Test", 
          category: "Simulation",
          description: "Risk Check Simulation"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Extract results from backend API response [cite: 20, 25]
      const { risk_score, risk_level, reasons } = response.data;

      // Map backend Risk Level strings to Frontend UI components [cite: 26, 52, 53]
      let result: RiskResult;
      
      switch (risk_level) {
        case "PATTERN": // Case 4: Very High Amount at Night 
          result = { type: 'blocked', score: risk_score, reasons };
          break;
        case "HIGH":    // Case 3: High Risk Fraud [cite: 35, 38]
          result = { type: 'high', score: risk_score, reasons };
          break;
        case "MEDIUM":  // Case 2: Medium Risk / Suspicious [cite: 31, 34]
          result = { type: 'medium', score: risk_score, reasons };
          break;
        case "SAFE":    // Case 1: Safe Transaction [cite: 27, 30]
        default:
          result = { type: 'safe', score: risk_score, reasons };
      }

      setRiskResult(result);
    } catch (error: any) {
      toast.error("Failed to connect to Guard Engine");
      console.error("Risk Check Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = () => setRiskResult(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar 
        username={userData.username} 
        onLogout={handleLogout}
        userEmail={userData.email} 
      />

      {/* Case 2 Banner: Suspicious / Medium Risk - Orange [cite: 34, 58, 60] */}
      {riskResult?.type === 'medium' && (
        <div className="px-6 pt-4">
          <MediumBanner score={riskResult.score} onClose={clearResult} />
        </div>
      )}

      <main className="p-6 max-w-7xl mx-auto space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4">
            <UserCard 
              username={userData.username} 
              upiId={userData.upi_id} 
            />
          </div>

          <div className="lg:col-span-8">
            <SimulationProtocol onCheckRisk={handleCheckRisk} loading={loading} />
          </div>
        </div>

        <AnalyticsDashboard />
      </main>

      {/* Modal and Overlay Triggers based on Backend Response status [cite: 53, 67] */}
      
      {/* Case 1: Safe - Green [cite: 30, 55, 57] */}
      {riskResult?.type === 'safe' && <SafeToast score={riskResult.score} onClose={clearResult} />}
      
      {/* Case 3: High Risk Fraud - Red [cite: 38, 61, 63] */}
      {riskResult?.type === 'high' && <HighModal score={riskResult.score} onClose={clearResult} />}
      
      {/* Case 4: Night Pattern - Dark Red  */}
      {riskResult?.type === 'blocked' && <BlockedOverlay score={riskResult.score} onClose={clearResult} />}
    </div>
  );
};

const handleLogout = () => {
  localStorage.removeItem("token"); // Clears the session
  window.location.href = "/"; // Sends user back to Login
};

export default Index;