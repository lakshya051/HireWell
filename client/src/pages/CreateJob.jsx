import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Note: The component name in your original file is CreateJobMinimal. I have renamed it to CreateJob for consistency.
export default function CreateJob() { 
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/job/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error || err.message}`);
        return;
      }
      
      alert(`Job Created Successfully! 🎉\n\nOur AI is finalizing the details. You can view the job in "My Jobs".`);

      navigate("/my-jobs");
    } catch (err) {
      console.error("Job creation error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0c0d24] font-inter text-white px-4 py-12 overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="w-full max-w-2xl p-8 space-y-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg">
            <div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-white">Create a New Job Posting</h2>
                <p className="mt-2 text-center text-sm text-gray-400">Provide the core details. Our AI will handle the rest.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input 
                  label="Job Title" 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  placeholder="e.g., Senior Frontend Engineer" 
                  disabled={loading} 
                />
                <Input 
                  label="Company" 
                  name="company" 
                  value={form.company} 
                  onChange={handleChange} 
                  placeholder="e.g., Acme Inc. or Confidential" 
                  disabled={loading} 
                />
                <Textarea 
                  label="Job Description & Skills" 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Describe the role, responsibilities, and key skills required..." 
                  disabled={loading} 
                />
                <div>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full justify-center rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 py-3 px-4 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Generating Job Post..." : "Create with AI"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}

const Input = ({ label, disabled, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input 
          {...props} 
          disabled={disabled}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50"
          required
        />
    </div>
);

const Textarea = ({ label, disabled, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <textarea 
          {...props} 
          rows={5} 
          disabled={disabled}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-none disabled:opacity-50"
          required
        />
    </div>
);