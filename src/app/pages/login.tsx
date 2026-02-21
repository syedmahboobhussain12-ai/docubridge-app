import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Updated to react-router-dom
import { motion } from "framer-motion"; // Motion usually comes from framer-motion
import { FileText, ArrowRight } from "lucide-react";
import API from "../../api"; // Importing your API helper

export function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"student" | "mentor" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send the data to your Render Backend
      const response = await API.post("/auth/login", {
        email: email,
        password: password,
      });

      // 2. Save the Token and User data to the browser
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // 3. Check if the logged-in user's role matches the toggle they selected
      if (response.data.user.role !== userType) {
         alert(`This account is registered as a ${response.data.user.role}, not a ${userType}.`);
         setLoading(false);
         return;
      }

      // 4. Navigate to the correct dashboard based on role
      if (userType === "student") {
        navigate("/student-dashboard");
      } else if (userType === "mentor") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a0f1e]">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-5" style={{ background: '#2563eb' }}></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-5" style={{ background: '#2563eb' }}></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl opacity-30" style={{ background: '#2563eb' }}></div>
                  <FileText className="w-32 h-32 text-white relative z-10" strokeWidth={1.5} />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl mb-4 text-white tracking-tight font-semibold"
              >
                DocuBridge
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed"
              >
                Connecting students and mentors through seamless document collaboration
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0f172a]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#334155] p-8">
            <div className="mb-8">
              <h2 className="text-3xl mb-2 text-white font-semibold tracking-tight">Welcome back</h2>
              <p className="text-[#94a3b8]">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* User Type Toggle */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#0f172a] rounded-xl border border-[#334155]">
                {(['student', 'mentor', 'admin'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={`py-2.5 px-3 rounded-lg transition-all duration-200 font-medium text-sm capitalize ${
                      userType === type
                        ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20"
                        : "text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block mb-2 text-[#e2e8f0] font-medium">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block mb-2 text-[#e2e8f0] font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                type="submit"
                className={`w-full py-3.5 px-6 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${
                  loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#2563eb] hover:bg-[#1d4ed8] shadow-blue-500/25"
                }`}
              >
                {loading ? "Signing in..." : `Sign in as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}