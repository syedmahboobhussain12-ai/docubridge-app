import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { 
  FileText, 
  LogOut, 
  Users,
  UserPlus,
  UserMinus,
  Search,
  Filter,
  ChevronDown,
  Shield,
  Edit,
  Trash2
} from "lucide-react";

interface Student {
  rollNo: string;
  name: string;
  email: string;
  mentor: string | null;
  documentCount: number;
}

interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  studentCount: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMentor, setFilterMentor] = useState<string>("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMentorForAssignment, setSelectedMentorForAssignment] = useState<string>("");

  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: "M001",
      name: "Dr. Sarah Williams",
      email: "s.williams@university.edu",
      department: "Computer Science",
      studentCount: 5
    },
    {
      id: "M002",
      name: "Dr. Michael Chen",
      email: "m.chen@university.edu",
      department: "Computer Science",
      studentCount: 8
    },
    {
      id: "M003",
      name: "Dr. Emily Rodriguez",
      email: "e.rodriguez@university.edu",
      department: "Data Science",
      studentCount: 12
    }
  ]);

  const [students, setStudents] = useState<Student[]>([
    { rollNo: "CS2024001", name: "Alice Johnson", email: "alice.johnson@university.edu", mentor: "Dr. Sarah Williams", documentCount: 2 },
    { rollNo: "CS2024002", name: "Bob Smith", email: "bob.smith@university.edu", mentor: "Dr. Sarah Williams", documentCount: 1 },
    { rollNo: "CS2024003", name: "Charlie Davis", email: "charlie.davis@university.edu", mentor: "Dr. Sarah Williams", documentCount: 2 },
    { rollNo: "CS2024004", name: "Diana Martinez", email: "diana.martinez@university.edu", mentor: "Dr. Sarah Williams", documentCount: 0 },
    { rollNo: "CS2024005", name: "Evan Wilson", email: "evan.wilson@university.edu", mentor: "Dr. Sarah Williams", documentCount: 1 },
    { rollNo: "CS2024006", name: "Fiona Blake", email: "fiona.blake@university.edu", mentor: "Dr. Michael Chen", documentCount: 3 },
    { rollNo: "CS2024007", name: "George Thompson", email: "george.thompson@university.edu", mentor: "Dr. Michael Chen", documentCount: 2 },
    { rollNo: "CS2024008", name: "Hannah Lee", email: "hannah.lee@university.edu", mentor: "Dr. Michael Chen", documentCount: 1 },
    { rollNo: "CS2024009", name: "Isaac Brown", email: "isaac.brown@university.edu", mentor: "Dr. Michael Chen", documentCount: 4 },
    { rollNo: "CS2024010", name: "Julia White", email: "julia.white@university.edu", mentor: "Dr. Michael Chen", documentCount: 2 },
    { rollNo: "CS2024011", name: "Kevin Park", email: "kevin.park@university.edu", mentor: "Dr. Michael Chen", documentCount: 1 },
    { rollNo: "CS2024012", name: "Laura Green", email: "laura.green@university.edu", mentor: "Dr. Michael Chen", documentCount: 0 },
    { rollNo: "CS2024013", name: "Marcus Taylor", email: "marcus.taylor@university.edu", mentor: "Dr. Michael Chen", documentCount: 3 },
    { rollNo: "CS2024014", name: "Nina Patel", email: "nina.patel@university.edu", mentor: "Dr. Emily Rodriguez", documentCount: 2 },
    { rollNo: "CS2024015", name: "Oliver Scott", email: "oliver.scott@university.edu", mentor: "Dr. Emily Rodriguez", documentCount: 1 },
    { rollNo: "CS2024016", name: "Paula Anderson", email: "paula.anderson@university.edu", mentor: null, documentCount: 0 },
    { rollNo: "CS2024017", name: "Quinn Roberts", email: "quinn.roberts@university.edu", mentor: null, documentCount: 0 },
    { rollNo: "CS2024018", name: "Rachel Kim", email: "rachel.kim@university.edu", mentor: null, documentCount: 1 },
  ]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleAssignMentor = () => {
    if (selectedStudent && selectedMentorForAssignment) {
      const mentor = mentors.find(m => m.id === selectedMentorForAssignment);
      if (mentor) {
        setStudents(students.map(s => 
          s.rollNo === selectedStudent.rollNo 
            ? { ...s, mentor: mentor.name }
            : s
        ));
        setMentors(mentors.map(m =>
          m.id === selectedMentorForAssignment
            ? { ...m, studentCount: m.studentCount + 1 }
            : m
        ));
      }
      setShowAssignModal(false);
      setSelectedStudent(null);
      setSelectedMentorForAssignment("");
    }
  };

  const handleDeassignMentor = (student: Student) => {
    if (student.mentor) {
      const mentor = mentors.find(m => m.name === student.mentor);
      if (mentor) {
        setMentors(mentors.map(m =>
          m.id === mentor.id
            ? { ...m, studentCount: Math.max(0, m.studentCount - 1) }
            : m
        ));
      }
      setStudents(students.map(s => 
        s.rollNo === student.rollNo 
          ? { ...s, mentor: null }
          : s
      ));
    }
  };

  const openAssignModal = (student: Student) => {
    setSelectedStudent(student);
    setShowAssignModal(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterMentor === "all") return matchesSearch;
    if (filterMentor === "unassigned") return matchesSearch && !student.mentor;
    
    return matchesSearch && student.mentor === filterMentor;
  });

  const stats = {
    totalStudents: students.length,
    totalMentors: mentors.length,
    assigned: students.filter(s => s.mentor).length,
    unassigned: students.filter(s => !s.mentor).length,
    totalDocuments: students.reduce((sum, s) => sum + s.documentCount, 0)
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b]/50 backdrop-blur-xl border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" style={{ color: '#2563eb' }} />
            <div>
              <h1 className="text-xl text-white font-semibold tracking-tight">DocuBridge</h1>
              <p className="text-sm text-[#64748b] font-medium">Admin Portal</p>
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
          className="mb-12"
        >
          <h2 className="text-4xl mb-3 text-white font-semibold tracking-tight">Admin Dashboard</h2>
          <p className="text-lg text-[#94a3b8]">Manage students, mentors, and assignments</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12"
        >
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Total Students</p>
            <p className="text-3xl text-white font-semibold">{stats.totalStudents}</p>
          </div>
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Total Mentors</p>
            <p className="text-3xl text-white font-semibold">{stats.totalMentors}</p>
          </div>
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Assigned</p>
            <p className="text-3xl font-semibold" style={{ color: '#22c55e' }}>{stats.assigned}</p>
          </div>
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Unassigned</p>
            <p className="text-3xl font-semibold" style={{ color: '#ef4444' }}>{stats.unassigned}</p>
          </div>
          <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]">
            <p className="text-sm mb-2 text-[#64748b] font-medium uppercase tracking-wider">Documents</p>
            <p className="text-3xl text-white font-semibold">{stats.totalDocuments}</p>
          </div>
        </motion.div>

        {/* Mentors Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl mb-6 text-white font-semibold tracking-tight">Mentors Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155] hover:border-[#475569] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#2563eb]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{mentor.name}</h4>
                      <p className="text-sm text-[#64748b]">{mentor.department}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94a3b8]">Students Assigned</span>
                  <span className={`text-lg font-semibold ${mentor.studentCount >= 25 ? 'text-yellow-400' : 'text-white'}`}>
                    {mentor.studentCount} / 30
                  </span>
                </div>
                {mentor.studentCount >= 25 && (
                  <p className="mt-3 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                    ⚠️ Approaching capacity limit
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155] mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search by name, roll number, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={filterMentor}
                onChange={(e) => setFilterMentor(e.target.value)}
                className="appearance-none pl-4 pr-12 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all cursor-pointer font-medium"
              >
                <option value="all">All Students</option>
                <option value="unassigned">Unassigned</option>
                {mentors.map(mentor => (
                  <option key={mentor.id} value={mentor.name}>{mentor.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-[#64748b]" />
            </div>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl border border-[#334155] overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-[#0f172a]/50 px-6 py-4 border-b border-[#334155]">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#64748b] font-semibold">Roll Number</p>
              </div>
              <div className="col-span-3">
                <p className="text-xs uppercase tracking-wider text-[#64748b] font-semibold">Student Name</p>
              </div>
              <div className="col-span-3">
                <p className="text-xs uppercase tracking-wider text-[#64748b] font-semibold">Email</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#64748b] font-semibold">Assigned Mentor</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#64748b] font-semibold">Actions</p>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#334155] max-h-[600px] overflow-y-auto">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.rollNo}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="px-6 py-4 hover:bg-[#0f172a]/30 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Roll Number */}
                  <div className="col-span-2">
                    <p className="text-white font-semibold">{student.rollNo}</p>
                  </div>

                  {/* Student Name */}
                  <div className="col-span-3">
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-xs text-[#64748b]">{student.documentCount} documents</p>
                  </div>

                  {/* Email */}
                  <div className="col-span-3">
                    <p className="text-sm text-[#94a3b8]">{student.email}</p>
                  </div>

                  {/* Assigned Mentor */}
                  <div className="col-span-2">
                    {student.mentor ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
                        {student.mentor.split(' ').slice(1).join(' ')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                        Unassigned
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center gap-2">
                    {student.mentor ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeassignMentor(student)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                      >
                        <UserMinus className="w-4 h-4" />
                        Remove
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openAssignModal(student)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563eb]/20 border border-[#2563eb]/40 text-[#2563eb] hover:bg-[#2563eb]/30 transition-colors text-sm font-medium"
                      >
                        <UserPlus className="w-4 h-4" />
                        Assign
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-10 text-[#64748b]" />
              <p className="text-lg text-[#64748b]">No students found</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Assign Mentor Modal */}
      {showAssignModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e293b] rounded-2xl border border-[#334155] p-8 max-w-md w-full"
          >
            <h3 className="text-2xl text-white font-semibold mb-2">Assign Mentor</h3>
            <p className="text-[#94a3b8] mb-6">
              Assign a mentor to {selectedStudent.name} ({selectedStudent.rollNo})
            </p>

            <div className="mb-6">
              <label className="block text-[#e2e8f0] font-medium mb-2">Select Mentor</label>
              <select
                value={selectedMentorForAssignment}
                onChange={(e) => setSelectedMentorForAssignment(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
              >
                <option value="">Choose a mentor...</option>
                {mentors.map(mentor => (
                  <option 
                    key={mentor.id} 
                    value={mentor.id}
                    disabled={mentor.studentCount >= 30}
                  >
                    {mentor.name} ({mentor.studentCount}/30) {mentor.studentCount >= 30 ? '- Full' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedStudent(null);
                  setSelectedMentorForAssignment("");
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-[#334155]/50 text-white hover:bg-[#334155] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignMentor}
                disabled={!selectedMentorForAssignment}
                className="flex-1 px-4 py-3 rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Mentor
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
