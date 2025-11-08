

function Timeline() {
    const steps = [
      { title: "Create Job Instantly", desc: "Use AI-assisted job creation to auto-generate optimized job descriptions." },
      { title: "Automated Interviews", desc: "AI conducts structured interviews and captures key behavioral insights." },
      { title: "Instant Reports", desc: "Get a detailed, data-driven summary of every applicant automatically." },
      { title: "Faster Hiring", desc: "Hire the best talent with minimal effort and maximum efficiency." },
    ];
  
    return (
      <section className="bg-[#0c0d24] py-24 px-6 font-inter">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">The <span className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient">HireWell</span> Timeline</h2>
        </div>
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-white/10" />
            
            {/* Timeline Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative pl-12 md:pl-0">
                  <div className="md:flex md:items-center md:justify-center">
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:order-2'}`}>
                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg">
                        <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400 text-sm">{step.desc}</p>
                      </div>
                    </div>
                    <div className="absolute md:relative left-4 top-1/2 -translate-y-1/2 md:left-0 md:top-auto md:translate-y-0 h-8 w-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 flex items-center justify-center ring-8 ring-[#0c0d24]">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div className="hidden md:block md:w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default Timeline;