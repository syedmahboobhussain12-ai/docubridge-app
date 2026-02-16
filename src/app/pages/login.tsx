import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { FileText, ArrowRight } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"student" | "mentor" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === "student") {
      navigate("/student");
    } else if (userType === "mentor") {
      navigate("/mentor");
    } else {
      navigate("/admin");
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
            {/* Decorative background elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-5" style={{ background: '#2563eb' }}></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-5" style={{ background: '#2563eb' }}></div>
            
            {/* Main illustration */}
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

              {/* Floating document cards */}
              <div className="mt-16 relative h-48">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-1/4 top-0 w-32 h-40 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-2xl"
                />
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute right-1/4 top-8 w-32 h-40 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-2xl"
                />
              </div>
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
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <FileText className="w-12 h-12 mr-3" style={{ color: '#2563eb' }} />
            <h1 className="text-3xl text-white font-semibold">DocuBridge</h1>
          </div>

          {/* Glassmorphism Card */}
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#334155] p-8">
            <div className="mb-8">
              <h2 className="text-3xl mb-2 text-white font-semibold tracking-tight">Welcome back</h2>
              <p className="text-[#94a3b8]">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* User Type Toggle */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#0f172a] rounded-xl border border-[#334155]">
                <button
                  type="button"
                  onClick={() => setUserType("student")}
                  className={`py-2.5 px-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                    userType === "student"
                      ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("mentor")}
                  className={`py-2.5 px-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                    userType === "mentor"
                      ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  Mentor
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`py-2.5 px-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                    userType === "admin"
                      ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block mb-2 text-[#e2e8f0] font-medium">
                  {userType === "student" ? "Roll Number / Email" : "Email address"}
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={userType === "student" ? "CS2024001 or student@example.com" : "you@example.com"}
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded bg-[#0f172a] border-[#334155]" style={{ accentColor: '#2563eb' }} />
                  <span className="text-sm text-[#94a3b8]">Remember me</span>
                </label>
                <a href="#" className="text-sm text-[#2563eb] hover:text-[#3b82f6] transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all bg-[#2563eb] hover:bg-[#1d4ed8]"
              >
                Sign in as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-[#334155] text-center">
              <p className="text-sm text-[#94a3b8]">
                Need help? Contact{" "}
                <a href="#" className="text-[#2563eb] hover:text-[#3b82f6] transition-colors font-medium">
                  support@docubridge.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
