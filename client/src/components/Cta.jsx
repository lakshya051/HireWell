import { Link } from 'react-router-dom';

function CTA() {
  return (
    <div className="bg-[#0c0d24]">
      <div className="mx-auto max-w-4xl py-16 px-6 text-center sm:py-20 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to revolutionize your hiring?</span>
          <span className="block bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient">Try a Demo Interview now.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-gray-300">
          Experience the power of an AI-led interview firsthand. No sign-up required.
        </p>
        <Link
          to="/jobs"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:opacity-90 transition"
        >
          Start a Demo
        </Link>
      </div>
    </div>
  );
}

export default CTA;