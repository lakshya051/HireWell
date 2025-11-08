import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Report() {
  const { interviewId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/interview/report/${interviewId}`);
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Report fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  // Function to handle the download
  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0d24]">
        <div className="text-purple-400 text-xl animate-pulse">Generating Secure Report...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0c0d24] py-24 px-4 font-inter text-white overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Download Button - only visible for recruiters */}
        {user && user.role === 'recruiter' && (
            <div className="text-center mb-8">
                <button 
                    onClick={handleDownload}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-full transition-colors"
                >
                    Download Report (PDF)
                </button>
            </div>
        )}

        <div id="report-content" className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient mb-2">Interview Report</h1>
            <p className="text-gray-300">Candidate: {report.candidateName}</p>
            <p className="text-gray-400 text-sm">Position: {report.job?.title}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="bg-black/20 rounded-xl p-6">
              <p className="text-4xl font-bold text-fuchsia-400">{report.totalScore || 'N/A'}<span className="text-2xl text-gray-400">/100</span></p>
              <h3 className="text-sm font-semibold text-gray-300 mt-2">Overall Score</h3>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <p className="text-4xl font-bold text-fuchsia-400">{Math.round((new Date(report.completedAt) - new Date(report.startedAt)) / 60000)}</p>
              <h3 className="text-sm font-semibold text-gray-300 mt-2">Duration (Minutes)</h3>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <p className="text-4xl font-bold text-green-400 capitalize">{report.status}</p>
              <h3 className="text-sm font-semibold text-gray-300 mt-2">Status</h3>
            </div>
          </div>

          {user && user.role === 'recruiter' && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">AI Candidate Analysis</h3>
              <div className="bg-black/20 rounded-xl p-6 text-gray-300 leading-relaxed">
                {report?.report || "AI analysis not available for this interview."}
              </div>
            </div>
          )}

          {(!user || user.role !== 'recruiter') && (
            <div className="text-center bg-black/20 rounded-xl p-6">
              <p className="text-lg font-semibold text-white">Thank you for completing the interview!</p>
              <p className="text-gray-400">The hiring team will review your results and be in touch soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}