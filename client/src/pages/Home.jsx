import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext"; // Import useAuth to check user role

// Helper for Icons (no changes here)
const Icon = ({ path }) => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Features component (no changes here)
const Features = () => {
  const featureList = [
    { icon: <Icon path="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />, title: "AI-Powered Job Creation", text: "Generate optimized job posts from simple inputs in seconds." },
    { icon: <Icon path="M8 9l4-4 4 4m0 6l-4 4-4-4" />, title: "Automated Interviews", text: "Let our AI conduct structured, coding-based interviews 24/7." },
    { icon: <Icon path="M9 17v-2a4 4 0 018 0v2" />, title: "Instant, In-Depth Reports", text: "Receive comprehensive analysis and scores for every candidate." },
    { icon: <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />, title: "Effortless Shortlisting", text: "Identify top candidates based on data-driven AI recommendations." },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient">The Future is Here</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Hire Automatically</p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            From creating the perfect job description to analyzing interview performance, HireWell streamlines your entire workflow.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {featureList.map((feature) => (
            <motion.div
              whileHover={{ y: -8 }}
              key={feature.title}
              className="flex flex-col items-center text-center p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-600">
                {feature.icon}
              </div>
              <h3 className="mt-6 font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { isAuthenticated, user } = useAuth(); // Get user info

  return (
    <div className="bg-[#0c0d24] min-h-screen font-inter overflow-hidden">
      <div className="relative isolate">
        {/* Background Aurora */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center py-48 sm:py-64">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            The Intelligent Way to Hire <span className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient">Technical Talent</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Stop wasting time on manual screening. HireWell uses advanced AI to conduct interviews, analyze code, and identify top candidates for you.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/jobs" className="rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition">
              View Open Roles
            </Link>

            {/* **FIX APPLIED HERE**: Conditional "Post a Job" link */}
            {!isAuthenticated && (
              <Link to="/signup" className="text-sm font-semibold leading-6 text-white/80 hover:text-white">
                Post a Job <span aria-hidden="true">→</span>
              </Link>
            )}
            {isAuthenticated && user?.role === 'recruiter' && (
              <Link to="/create-job" className="text-sm font-semibold leading-6 text-white/80 hover:text-white">
                Post a New Job <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Features />
      <Footer />
    </div>
  );
}