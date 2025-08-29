import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/job/view/${jobId}`);
        if (!res.ok) throw new Error("Failed to fetch job details.");
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError("Failed to fetch job details.");
        console.error("Job fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/interview/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          candidateName: form.name,
          candidateEmail: form.email,
        }),
      });

      if (!res.ok) throw new Error("Failed to start interview");

      const data = await res.json();
      localStorage.setItem(`interview_${data.interviewId}`, JSON.stringify(data.questions));
      navigate(`/interview/${data.interviewId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to start interview. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-300 animate-pulse">Loading job details...</div>;
    }

    if (error || !job) {
      return (
        <div className="text-center">
          <p className="font-semibold text-lg mb-4 text-red-400">{error || "Job not found."}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white/10 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/20 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg p-8 sm:p-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient mb-2 text-center">
          {job.title} @ {job.company}
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Location: {job.location} | Type: {job.type}
        </p>
        <p className="text-sm text-gray-300 text-center mb-8">{job.description}</p>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Skills Required</h3>
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired?.map((skill, index) => (
              <span key={index} className="bg-white/10 text-fuchsia-300 px-3 py-1 rounded-full text-xs">{skill}</span>
            ))}
          </div>
        </div>
        
        <p className="text-xl font-bold text-center mb-6 text-white">Attend Technical Interview Now</p>

        {error && <p className="text-center text-red-400 text-sm my-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Full Name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required disabled={submitting} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required disabled={submitting} />
          <button type="submit" disabled={submitting} className="w-full justify-center rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 py-3 px-4 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
            {submitting ? "Starting Interview..." : "Start Interview"}
          </button>
        </form>
      </div>
    );
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0c0d24] font-inter text-white px-4 py-24 overflow-hidden">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80ffea] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
      <div className="w-full max-w-2xl">
        {renderContent()}
      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input {...props} className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
    </div>
);