import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { API_BASE_URL } from "../../config";
import { 
  FileText, 
  LogOut, 
  Download, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  ChevronDown,
  ChevronRight,
  User,
  Tag
} from "lucide-react";

interface Document {
  id: string;
  name: string; // Server field
  documentName?: string; // Mapped for UI
  submittedAt: string;
  status: "pending" | "reviewed" | "rejected";
  size: string;
  type: string;
  tags: string[];
}

interface Student {
  rollNo: string;
  name: string;
  email: string;
  documents: Document[];
}

export function MentorDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "reviewed" | "rejected">("all");
  const [expandedStudent, setExpandedStudent] = useState<string | null>("CS2024001");
  const [students, setStudents] = useState<Student[]>([]);

  // --- 1. FETCH REAL DATA FROM SERVER ---
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/documents`);
        const docs = await response.json();

        // Map server data to fit the Student UI structure
        const mappedDocs = docs.map((d: any) => ({
          ...d,
          documentName: d.name, // Mapping 'name' from API to 'documentName' for this UI
          submittedAt: d.uploadedAt + (d.submittedAt ? ` - ${d.submittedAt.split(',')[1] || ''}` : ""),
          type: d.type || "FILE"
        }));

        // Assign all fetched docs to our mock "Alice" for demonstration
        const alice: Student = {
          rollNo: "CS2024001",
          name: "Alice Johnson",
          email: "alice.johnson@university.edu",
          documents: mappedDocs
        };

        setStudents([alice]);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchDocuments();
    // Poll for real-time updates every 5 seconds
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const mentorInfo = {
    name: "Dr. Sarah Williams",
    department: "Computer Science",
    totalStudents: students.length
  };

  const handleLogout = () => {
    navigate("/");
  };

  // --- 2. REAL STATUS UPDATE ---
  const handleStatusChange = async (studentRollNo: string, docId: string, status: "reviewed" | "rejected") => {
    try {
      // Optimistic UI update
      setStudents(prev => prev.map(student => {
        if (student.rollNo === studentRollNo) {
          return {
            ...student,
            documents: student.documents.map(doc => 
              doc.id === docId ? { ...doc, status } : doc
            )
          };
        }
        return student;
      }));

      // Send to server
      await fetch(`${API_BASE_URL}/api/documents/${docId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleStudent = (rollNo: string) => {
    setExpandedStudent(expandedStudent === rollNo ? null : rollNo);
  };

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.documents.some(doc => (doc.documentName || doc.name).toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterStatus === "all") return matchesSearch;
    
    const hasMatchingStatus = student.documents.some(doc => doc.status === filterStatus);
    return matchesSearch && hasMatchingStatus;
  });

  const getAllDocuments = () => {
    return students.flatMap(student => student.documents);
  };

  const stats = {
    totalDocuments: getAllDocuments().length,
    pending: getAllDocuments().filter(d => d.status === "pending").length,
    reviewed: getAllDocuments().filter(d => d.status === "reviewed").length,
    rejected: getAllDocuments().filter(d => d.status === "rejected").length
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b]/50 backdrop-blur-xl border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" style={{ color: '#2563eb' }} />
            <div>
              <h1 className="text-xl text-white font-semibold tracking-tight">DocuBridge</h1>
              <p className="text-sm text-[#64748b] font-medium">Mentor Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#334155]/50 transition-colors text-[#94a3b8] hover:text-white font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]"
        >
          <h2 className="text-3xl mb-2 text-white font-semibold tracking-tight">Welcome, {mentorInfo.name}</h2>
          <div className="flex items-center gap-6 text-[#94a3b8]">
            <p className="flex items-center gap-2">
              <span className="text-[#64748b] font-medium">Department:</span>
              <span className="text-white font-semibold">{mentorInfo.department}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#64748b] font-medium">Assigned Students:</span>
              <span className="text-white font-semibold">{mentorInfo.totalStudents} / 30</span>
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Total Documents</p>
            <p className="text-3xl text-white font-semibold">{stats.totalDocuments}</p>
          </div>
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Pending Review</p>
            <p className="text-3xl font-semibold" style={{ color: '#eab308' }}>{stats.pending}</p>
          </div>
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Approved</p>
            <p className="text-3xl font-semibold" style={{ color: '#22c55e' }}>{stats.reviewed}</p>
          </div>
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Rejected</p>
            <p className="text-3xl font-semibold" style={{ color: '#ef4444' }}>{stats.rejected}</p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155] mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search by student name, roll number, or document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="appearance-none pl-4 pr-12 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all cursor-pointer font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-[#64748b]" />
            </div>
          </div>
        </motion.div>

        {/* Student Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-2xl mb-6 text-white font-semibold tracking-tight">Your Students</h3>

          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.rollNo}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl border border-[#334155] overflow-hidden"
            >
              <button
                onClick={() => toggleStudent(student.rollNo)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#0f172a]/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-[#2563eb]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-semibold mb-1">{student.name}</h4>
                    <p className="text-sm text-[#64748b]">
                      {student.rollNo} • {student.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#64748b] font-medium">
                      {student.documents.length} {student.documents.length === 1 ? 'document' : 'documents'}
                    </span>
                    {student.documents.some(d => d.status === 'pending') && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: expandedStudent === student.rollNo ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-[#64748b]" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {expandedStudent === student.rollNo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-[#334155]">
                      {student.documents.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-10 text-[#64748b]" />
                          <p className="text-[#64748b]">No documents uploaded yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4 mt-4">
                          {student.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="bg-[#0f172a]/50 rounded-lg p-4 border border-[#334155] hover:border-[#475569] transition-all"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#2563eb]/10 border border-[#2563eb]/20">
                                    <FileText className="w-5 h-5" style={{ color: '#2563eb' }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate mb-1">{doc.documentName}</p>
                                    <p className="text-sm text-[#64748b]">
                                      {doc.size} • {doc.type} • {doc.submittedAt}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 ml-4">
                                  {getStatusBadge(doc.status)}

                                  <div className="flex items-center gap-1">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="p-2 rounded-lg hover:bg-[#2563eb]/10 transition-colors text-[#94a3b8] hover:text-[#2563eb]"
                                      title="Download"
                                    >
                                      <Download className="w-4 h-4" />
                                    </motion.button>

                                    {doc.status === "pending" && (
                                      <>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => handleStatusChange(student.rollNo, doc.id, "reviewed")}
                                          className="p-2 rounded-lg hover:bg-green-500/10 transition-colors text-[#94a3b8] hover:text-green-400"
                                          title="Approve"
                                        >
                                          <CheckCircle2 className="w-4 h-4" />
                                        </motion.button>

                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => handleStatusChange(student.rollNo, doc.id, "rejected")}
                                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-[#94a3b8] hover:text-red-400"
                                          title="Reject"
                                        >
                                          <XCircle className="w-4 h-4" />
                                        </motion.button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}