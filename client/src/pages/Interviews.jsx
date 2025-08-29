import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]); // State to hold the recruiter's jobs
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState('all'); // State for the job filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both interviews and the recruiter's jobs at the same time
        const [interviewsRes, jobsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/interview/all`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/job/my-jobs`, { credentials: 'include' })
        ]);
        
        const interviewsData = await interviewsRes.json();
        const jobsData = await jobsRes.json();

        setInterviews(interviewsData);
        setJobs(jobsData.jobs || []); // Set the jobs for the dropdown
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Updated filtering logic to include the new job filter
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          interview.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === 'all' || interview.job?._id === selectedJob;
    return matchesSearch && matchesJob;
  });

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative min-h-screen bg-[#0c0d24] pt-32 pb-16 font-inter text-white overflow-hidden">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9089fc] to-[#80ffea] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-8">Interview Dashboard</h1>
        
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <input
              type="text"
              placeholder="Search by candidate name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            {/* New Job Filter Dropdown */}
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full bg-[#1e1f38] border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="all">Filter by Job: All</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg overflow-hidden">
          {loading ? (
            <p className="p-8 text-center">Loading interviews...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredInterviews.map((interview) => (
                    <tr key={interview._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-white">{interview.candidateName}</div>
                          <div className="text-sm text-gray-400">{interview.candidateEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{interview.job?.title || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${interview.status === 'completed' ? 'bg-green-400/10 text-green-300' : 'bg-yellow-400/10 text-yellow-300'}`}>
                          {interview.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap font-bold ${getScoreColor(interview.totalScore)}`}>
                        {interview.totalScore ? `${interview.totalScore}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(interview.startedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {interview.status === 'completed' &&
                          <Link to={`/report/${interview._id}`} className="text-fuchsia-400 hover:text-fuchsia-300 font-medium">View Report</Link>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInterviews.length === 0 && (
                <p className="p-8 text-center text-gray-400">No interviews found for the selected criteria.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}