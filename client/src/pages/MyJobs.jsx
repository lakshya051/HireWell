import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// I've added some simple SVG icons for the buttons to make them more intuitive.
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);
const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/job/my-jobs`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setDeleting(jobId);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/job/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setJobs(jobs.filter(job => job._id !== jobId));
        alert('Job deleted successfully!');
      } else {
        alert('Failed to delete job');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete job');
    } finally {
      setDeleting(null);
    }
  };

  const handleShare = async (jobId) => {
    const shareUrl = `${window.location.origin}/apply-job/${jobId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Job link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert(`Share this link: ${shareUrl}`);
    }
  };

  if (loading) {
    return (
      // A slightly more engaging loading spinner
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-yellow-400 text-xl">Loading your jobs...</span>
        </div>
      </div>
    );
  }

  return (
    // Changed the background for a softer dark theme and adjusted padding
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header section with a bottom border for better separation */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-10 pb-6 border-b border-gray-700">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">My Job Postings</h1>
            <p className="text-gray-400">Manage, edit, and share all your active job postings.</p>
          </div>
          <Link
            to="/create-job"
            className="mt-4 sm:mt-0 bg-yellow-400 text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 flex items-center shadow-lg shadow-yellow-500/10"
          >
            <span className="text-xl mr-2">+</span> Create New Job
          </Link>
        </header>

        {jobs.length === 0 ? (
          // A more visually appealing empty state
          <div className="text-center py-20 bg-gray-800 rounded-xl border border-dashed border-gray-600">
            <div className="text-gray-400">
              <svg className="mx-auto h-20 w-20 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-semibold text-white mb-2">No Jobs Found</h3>
              <p className="max-w-md mx-auto">Looks like you haven't posted any jobs yet. Get started by creating one now.</p>
            </div>
            <Link
              to="/create-job"
              className="mt-8 inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          // Changed layout to a vertical stack with more spacing
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                // Updated card design: new background, border, shadow, and transition for a "lift" effect
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 transition-all duration-300 hover:shadow-2xl hover:border-yellow-400/50 hover:-translate-y-1"
              >
                {/* Main content of the card */}
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Left side: Job details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h2 className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors">
                        <Link to={`/apply-job/${job._id}`}>{job.title}</Link>
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
                        job.isActive
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {job.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 font-medium">{job.company} • <span className="text-gray-500">{job.location}</span></p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 mb-4">
                      <span>💼 {job.type}</span>
                      <span>📈 {job.experienceRequired}</span>
                      <span>👥 {job.applicants?.length || 0} Applicants</span>
                      <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {job.skillsRequired?.slice(0, 5).map((skill, index) => (
                        <span key={index} className="bg-gray-700 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired?.length > 5 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{job.skillsRequired.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side: Salary and action buttons */}
                  <div className="flex flex-col justify-between items-start md:items-end gap-4">
                    {job.salaryRange && (
                      <div className="text-right">
                        <span className="text-xl font-semibold text-green-400">
                          ₹{job.salaryRange.min?.toLocaleString()} - ₹{job.salaryRange.max?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{job.salaryRange.currency}</span>
                      </div>
                    )}
                    {/* Updated button styles with icons and more distinct appearances */}
                    <div className="flex flex-row md:flex-row gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleShare(job._id)}
                        className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full"
                      >
                        <ShareIcon /> Share
                      </button>
                      <Link
                        to={`/apply-job/${job._id}`}
                        className="flex items-center justify-center bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 px-4 py-2 rounded-lg text-sm font-medium transition text-center w-full"
                      >
                        <ViewIcon /> View
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={deleting === job._id}
                        className="flex items-center justify-center bg-red-600/20 hover:bg-red-600/30 disabled:opacity-50 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition w-full"
                      >
                        {deleting === job._id ? '...' : <DeleteIcon />} {deleting === job._id ? '' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}