import React, { useState } from 'react';
import { 
  LayoutDashboard, Inbox, CheckSquare, FileText, Database, 
  Layers, Cpu, ShieldCheck, CheckCircle2, XCircle, 
  RefreshCw, Send, Search, Filter, AlertTriangle, ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReq, setSelectedReq] = useState(null);
  const [studentInput, setStudentInput] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [requests, setRequests] = useState([
    {
      id: "CF-1024",
      student: "Ridhima Gupta",
      enrollment_id: "23BXX123",
      department: "Computer Science",
      type: "Bonafide Certificate",
      purpose: "Scholarship Application",
      priority: "HIGH",
      confidence: 94,
      status: "Pending Approval",
      raw_text: "I need a bonafide certificate for my scholarship application. My enrollment number is 23BXX123 and my scholarship deadline is tomorrow.",
      reasoning: "Document required and urgent deadline identified. High extraction confidence."
    },
    {
      id: "CF-1025",
      student: "Arjun Sharma",
      enrollment_id: "23BXX124",
      department: "Electrical Eng.",
      type: "Fee Receipt",
      purpose: "Bank Loan Reimbursement",
      priority: "NORMAL",
      confidence: 97,
      status: "Approved",
      raw_text: "Please provide my fee receipt for bank loan approval.",
      reasoning: "Standard fee document request."
    },
    {
      id: "CF-1026",
      student: "Kabir Verma",
      enrollment_id: "23BXX126",
      department: "Civil Eng.",
      type: "Certificate Request",
      purpose: "Unknown",
      priority: "HIGH",
      confidence: 45,
      status: "Needs Human Review",
      raw_text: "I need a certificate urgently.",
      reasoning: "Ambiguous input. Missing document type and specific purpose."
    }
  ]);

  const [logs, setLogs] = useState([
    { id: "LOG-01", timestamp: "22 Aug 22:01", request_id: "CF-1024", event: "Request Received", action: "Create Record", actor: "CertiFlow Engine", result: "Success" },
    { id: "LOG-02", timestamp: "22 Aug 22:01", request_id: "CF-1024", event: "AI Interpretation", action: "Classify Request", actor: "AI Service (94%)", result: "Success" },
    { id: "LOG-03", timestamp: "22 Aug 22:01", request_id: "CF-1024", event: "Notion Sync", action: "Create Page in Inbox", actor: "Notion API", result: "Success" }
  ]);

  // Handle New Student Submission
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentInput.trim()) return;

    const newId = `CF-${1024 + requests.length}`;
    const isAmbiguous = studentInput.length < 20;

    const newReq = {
      id: newId,
      student: "Ridhima Gupta",
      enrollment_id: "23BXX123",
      department: "Computer Science",
      type: isAmbiguous ? "Unknown Request" : "Bonafide Certificate",
      purpose: isAmbiguous ? "Unknown" : "Scholarship Application",
      priority: isAmbiguous ? "HIGH" : "HIGH",
      confidence: isAmbiguous ? 45 : 94,
      status: isAmbiguous ? "Needs Human Review" : "Pending Approval",
      raw_text: studentInput,
      reasoning: isAmbiguous ? "Input ambiguous. Requires human evaluation." : "Structured fields extracted successfully."
    };

    setRequests([newReq, ...requests]);
    setLogs([
      { id: `LOG-${Date.now()}`, timestamp: "22 Aug 22:04", request_id: newId, event: "Request Received", action: "Created via Portal", actor: "Student", result: "Success" },
      ...logs
    ]);

    setStudentInput('');
    setActiveTab('inbox');
  };

  // Handle Admin Decision
  const handleDecision = (decision) => {
    if (!selectedReq) return;

    const updated = requests.map(r => {
      if (r.id === selectedReq.id) {
        return { ...r, status: decision === 'APPROVE' ? 'Completed' : 'Rejected' };
      }
      return r;
    });

    setRequests(updated);
    setSelectedReq({ ...selectedReq, status: decision === 'APPROVE' ? 'Completed' : 'Rejected' });

    setLogs([
      { 
        id: `LOG-${Date.now()}`, 
        timestamp: "22 Aug 22:05", 
        request_id: selectedReq.id, 
        event: decision === 'APPROVE' ? "Human Approval" : "Human Rejection", 
        action: decision === 'APPROVE' ? "Approved & PDF Created" : `Rejected: ${rejectReason || 'Criteria not met'}`, 
        actor: "Admin", 
        result: "Success" 
      },
      ...logs
    ]);

    setShowRejectModal(false);
    setRejectReason('');
  };

  const activeReq = selectedReq || requests[0];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide">CERTIFLOW</h1>
              <p className="text-[10px] text-indigo-400 font-mono">NOTION OPERATIONS HUB</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700 rounded">v1.0</span>
          </div>

          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inbox', label: 'Request Inbox', icon: Inbox },
              { id: 'approval', label: 'Approval Queue', icon: CheckSquare },
              { id: 'student', label: 'Student Portal', icon: Send },
              { id: 'runlog', label: 'Notion Run Log', icon: Database },
              { id: 'architecture', label: 'Architecture', icon: Cpu },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Workflow Engine</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Notion Hub</span>
            <span className="text-indigo-400 font-medium">Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Operations Hub Dashboard'}
              {activeTab === 'inbox' && 'Request Inbox'}
              {activeTab === 'approval' && 'Human Approval Queue'}
              {activeTab === 'student' && 'Student Self-Service Portal'}
              {activeTab === 'runlog' && 'Notion Audit Trail / Run Log'}
              {activeTab === 'architecture' && 'System Architecture'}
            </h2>
            <p className="text-xs text-slate-500">From Student Request to Approved Action — Automatically.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full">
            Notion API Ready
          </span>
        </header>

        <div className="p-8">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Total Requests</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{requests.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm bg-amber-50/30">
                  <p className="text-xs font-semibold text-amber-700 uppercase">Pending Approval</p>
                  <p className="text-3xl font-bold text-amber-800 mt-2">
                    {requests.filter(r => r.status === 'Pending Approval').length}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/30">
                  <p className="text-xs font-semibold text-emerald-700 uppercase">Completed</p>
                  <p className="text-3xl font-bold text-emerald-800 mt-2">
                    {requests.filter(r => r.status === 'Completed').length}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm bg-rose-50/30">
                  <p className="text-xs font-semibold text-rose-700 uppercase">Requires Attention</p>
                  <p className="text-3xl font-bold text-rose-800 mt-2">
                    {requests.filter(r => r.status === 'Needs Human Review').length}
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Recent Requests</h3>
                  <button onClick={() => setActiveTab('inbox')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View All</button>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-4">Request ID</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">AI Confidence</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-semibold text-indigo-600">{req.id}</td>
                        <td className="p-4 font-medium text-slate-800">{req.student}</td>
                        <td className="p-4 text-slate-600">{req.type}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                            req.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-slate-700">{req.confidence}%</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'Pending Approval' ? 'bg-amber-100 text-amber-800' :
                            req.status === 'Needs Human Review' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => { setSelectedReq(req); setActiveTab('approval'); }}
                            className="px-3 py-1 bg-indigo-50 text-indigo-600 font-medium text-xs rounded hover:bg-indigo-100"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inbox / Queue View */}
          {(activeTab === 'inbox' || activeTab === 'approval') && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <span className="font-mono text-sm font-bold text-indigo-600">{activeReq.id}</span>
                      <h3 className="text-lg font-bold text-slate-800">{activeReq.type}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
                      activeReq.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {activeReq.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block uppercase">Student Name</span>
                      <span className="font-semibold text-slate-800 text-sm">{activeReq.student}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Enrollment ID</span>
                      <span className="font-mono font-semibold text-slate-800 text-sm">{activeReq.enrollment_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Department</span>
                      <span className="font-semibold text-slate-800">{activeReq.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Purpose</span>
                      <span className="font-semibold text-slate-800">{activeReq.purpose}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-lg text-xs space-y-1">
                    <span className="font-semibold text-slate-500 uppercase block">Original Student Request</span>
                    <p className="italic text-slate-700">"{activeReq.raw_text}"</p>
                  </div>

                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs space-y-1">
                    <span className="font-semibold text-indigo-900 uppercase block">AI Reasoning Summary ({activeReq.confidence}% Confidence)</span>
                    <p className="text-indigo-950">{activeReq.reasoning}</p>
                  </div>

                  {activeReq.status === 'Completed' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-2">
                      <span className="font-bold text-emerald-800 block">✓ Certificate Generated & Email Dispatched</span>
                      <p className="text-emerald-700">Document generated and PDF link sent to student's college email address.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Human Controls */}
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <ShieldCheck size={20} />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Human Control Hub</h4>
                  </div>
                  <p className="text-xs text-slate-400">AI has parsed request. College administrator approval required before execution.</p>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleDecision('APPROVE')}
                      disabled={activeReq.status === 'Completed'}
                      className={`w-full py-2.5 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 ${
                        activeReq.status === 'Completed' ? 'bg-slate-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      <CheckCircle2 size={16} /> {activeReq.status === 'Completed' ? 'Approved & Completed' : 'Approve & Execute'}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={activeReq.status === 'Completed'}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Reject Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Portal View */}
          {activeTab === 'student' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Submit Administrative Request</h3>
                <p className="text-xs text-slate-500">Describe your request in natural language. CertiFlow's AI engine will structure it automatically.</p>
                
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <textarea
                    rows={4}
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder='e.g., "I need a bonafide certificate for my scholarship application. My enrollment number is 23BXX123 and my scholarship deadline is tomorrow."'
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Submit to CertiFlow
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Notion Run Log */}
          {activeTab === 'runlog' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-bold text-slate-800 flex items-center justify-between">
                <span>Notion Execution Audit Log</span>
                <span className="text-xs font-normal text-slate-500">{logs.length} entries recorded</span>
              </div>
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Request ID</th>
                    <th className="p-3">Event</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500">{log.timestamp}</td>
                      <td className="p-3 font-semibold text-indigo-600">{log.request_id}</td>
                      <td className="p-3 font-sans font-medium text-slate-800">{log.event}</td>
                      <td className="p-3 font-sans text-slate-600">{log.action}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded">{log.actor}</span></td>
                      <td className="p-3 text-emerald-600 font-bold">{log.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Architecture Tab */}
          {activeTab === 'architecture' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-slate-800">System Architecture Overview</h3>
              <p className="text-sm text-slate-600">CertiFlow integrates AI natural language parsing with Notion Operations Hub and human approval safeguards.</p>
              <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg space-y-2">
                <p>STUDENT REQUEST ➔ AI NLP PARSER ➔ NOTION OPERATIONS HUB ➔ ADMIN APPROVAL ➔ PDF ENGINE ➔ EMAIL DISPATCH</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full space-y-4">
            <h3 className="font-bold text-slate-800">Reject Request</h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full p-2 border rounded-lg text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-xs border rounded-lg">Cancel</button>
              <button onClick={() => handleDecision('REJECT')} className="px-4 py-2 text-xs bg-rose-600 text-white rounded-lg font-bold">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}