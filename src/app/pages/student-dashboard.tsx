import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { API_BASE_URL } from "../../config";
import { 
  Upload, 
  FileText, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Download,
  Trash2,
  Tag,
  X
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: "pending" | "reviewed" | "rejected";
  tags: string[];
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showTagInput, setShowTagInput] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);

  // Mock student data
  const studentInfo = {
    rollNo: "CS2024001",
    name: "Alice Johnson",
    mentor: "Dr. Sarah Williams"
  };

  // --- 1. LOAD DOCUMENTS FROM SERVER ---
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/documents`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };
    fetchDocs();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  // --- 2. REAL FILE UPLOAD LOGIC ---
  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      // Fake progress animation for UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 100);

      // Use backticks for the variable URL
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (response.ok) {
        setUploadProgress(100);
        const data = await response.json();
        
        // Add the real document returned by the server
        setDocuments((prev) => [data.document, ...prev]);
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } else {
        console.error("Upload failed");
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
    }
  };

  const handleAddTag = (docId: string) => {
    if (newTag.trim()) {
      setDocuments(documents.map(doc => 
        doc.id === docId 
          ? { ...doc, tags: [...doc.tags, newTag.trim()] }
          : doc
      ));
      setNewTag("");
      setShowTagInput(null);
    }
  };

  const handleRemoveTag = (docId: string, tagToRemove: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId 
        ? { ...doc, tags: doc.tags.filter(tag => tag !== tagToRemove) }
        : doc
    ));
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
            Reviewed
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

  const handleLogout = () => {
    navigate("/");
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
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
              <p className="text-sm text-[#64748b] font-medium">Student Portal</p>
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
        {/* Student Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155]"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl mb-2 text-white font-semibold tracking-tight">Welcome, {studentInfo.name}!</h2>
              <div className="flex items-center gap-6 text-[#94a3b8]">
                <p className="flex items-center gap-2">
                  <span className="text-[#64748b] font-medium">Roll No:</span>
                  <span className="text-white font-semibold">{studentInfo.rollNo}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#64748b] font-medium">Mentor:</span>
                  <span className="text-white font-semibold">{studentInfo.mentor}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative bg-[#1e293b]/30 rounded-2xl border-2 border-dashed p-16 transition-all duration-300 ${
              isDragging
                ? "border-[#2563eb] bg-[#2563eb]/5 scale-[1.02]"
                : "border-[#334155] hover:border-[#475569]"
            }`}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileInput}
            />
            
            <div className="text-center">
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-2xl opacity-20" style={{ background: '#2563eb' }}></div>
                  <Upload className="w-20 h-20 relative z-10" style={{ color: isDragging ? '#2563eb' : '#64748b' }} strokeWidth={1.5} />
                </div>
              </motion.div>

              <h3 className="text-2xl mb-3 text-white font-semibold tracking-tight">
                {isDragging ? "Drop your files here" : "Drag & drop your documents"}
              </h3>
              <p className="mb-6 text-lg text-[#94a3b8]">
                or browse from your computer
              </p>

              <label htmlFor="file-upload">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium cursor-pointer shadow-lg shadow-blue-500/25 bg-[#2563eb] hover:bg-[#1d4ed8] transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Browse Files
                </motion.div>
              </label>

              <p className="mt-6 text-sm text-[#64748b]">
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#94a3b8] font-medium">Uploading...</span>
                  <span className="text-sm text-[#2563eb] font-semibold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden border border-[#334155]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full rounded-full bg-[#2563eb]"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl mb-6 text-white font-semibold tracking-tight">Your Documents</h3>
          
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1e293b]/50 backdrop-blur-xl rounded-xl p-6 border border-[#334155] hover:border-[#475569] hover:shadow-xl hover:shadow-blue-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#2563eb]/10 border border-[#2563eb]/20">
                      <FileText className="w-6 h-6" style={{ color: '#2563eb' }} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="mb-1 text-white font-medium">{doc.name}</h4>
                      <p className="text-sm text-[#64748b]">
                        {doc.size} • Uploaded on {doc.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(doc.status)}
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-[#334155]/50 transition-colors text-[#94a3b8] hover:text-white">
                        <Download className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-[#94a3b8] hover:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-[#64748b]" />
                  {doc.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#2563eb]/10 border border-[#2563eb]/20 text-[#60a5fa] font-medium"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(doc.id, tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  
                  {showTagInput === doc.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTag(doc.id);
                          if (e.key === 'Escape') setShowTagInput(null);
                        }}
                        placeholder="Tag name..."
                        className="px-3 py-1 text-xs rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddTag(doc.id)}
                        className="px-3 py-1 text-xs rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowTagInput(doc.id)}
                      className="px-3 py-1 text-xs rounded-lg border border-dashed border-[#334155] text-[#64748b] hover:text-white hover:border-[#475569] transition-colors"
                    >
                      + Add Tag
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-16 bg-[#1e293b]/30 rounded-xl border border-[#334155]">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-10 text-[#64748b]" />
              <p className="text-lg text-[#64748b]">No documents uploaded yet</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}