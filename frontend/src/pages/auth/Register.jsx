import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Building,
  GraduationCap,
  CheckCircle2,
  Globe,
  FileText,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config/api";

const Register = () => {
  const navigate = useNavigate();
  // State aligns perfectly with backend models (user.model.js and organization.model.js)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    collegeCode: "", // Used to find Organization or Create Organization
    studentId: "", // Optional for students
    orgName: "", // Used by Admins
    domain: "", // Used by Admins
    contactEmail: "", // Used by Admins
  });
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, role };
      // Remove unused admin fields if registering as student
      if (role === "student") {
        delete payload.orgName;
        delete payload.domain;
        delete payload.contactEmail;
      }

      const response = await axios.post(`${API_URL}/auth/register`, payload);
      if (response.data.success) {
        localStorage.setItem("voisafe_token", response.data.data.token);
        localStorage.setItem(
          "voisafe_user",
          JSON.stringify(response.data.data.user),
        );

        toast.success("Account created successfully! Welcome to VoiSafe.");

        if (role === "student") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-150 h-150 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 mb-2">
              Join VoiSafe
            </h1>
            <p className="text-slate-400 font-medium">
              Create your secure, anonymous grievance account.
            </p>
          </div>

          {/* Status feedback is now handled via react-toastify */}

          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => setRole("student")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${role === "student" ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "bg-slate-800 text-slate-400 hover:text-white"}`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${role === "admin" ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "bg-slate-800 text-slate-400 hover:text-white"}`}
            >
              Organization Admin
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* User Fields (For Both) */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                  {role === "admin" ? "Set College Code" : "College Code"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <FileText size={18} />
                  </div>
                  <input
                    type="text"
                    name="collegeCode"
                    required
                    value={formData.collegeCode}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="e.g. SRM-123"
                  />
                </div>
              </div>
            </div>

            {/* Admin Specific Organization Creation Fields */}
            {role === "admin" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                    Organization Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Building size={16} />
                    </div>
                    <input
                      type="text"
                      name="orgName"
                      required
                      value={formData.orgName}
                      onChange={handleChange}
                      className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      placeholder="SRM University"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                    Email Domain
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Globe size={16} />
                    </div>
                    <input
                      type="text"
                      name="domain"
                      required
                      value={formData.domain}
                      onChange={handleChange}
                      className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      placeholder="srm.edu.in"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                    Contact Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      name="contactEmail"
                      required
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      placeholder="admin@srm.edu.in"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Student Specific Fields */}
            {role === "student" && (
              <div className="grid grid-cols-1 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                    Student ID (Optional - Anonymous)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <GraduationCap size={16} />
                    </div>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full bg-slate-950/50 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pl-10 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      placeholder="e.g. AP1911..."
                    />
                  </div>
                  <p className="text-xs text-slate-500 ml-2 mt-1">
                    This forms part of your encrypted decoupled identity.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.02] flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-slate-400 text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
