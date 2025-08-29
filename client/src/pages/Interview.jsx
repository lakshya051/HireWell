import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Interview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Monitoring states
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const codeEditorRef = useRef(null);

  // ... (useEffect for mobile detection and timer are correct)

  // Auto-submit interview - with camera fix
  const autoSubmitInterview = async () => {
    setSubmitting(true);
    setIsTimerRunning(false);

    // **FIX APPLIED HERE**: Stop camera tracks immediately
    if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000"}/api/interview/submit/${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            duration: timer,
            autoSubmitted: true,
            reason: "Multiple violations detected",
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to submit interview");
      localStorage.removeItem(`interview_${sessionId}`);
      if (document.fullscreenElement && !isMobile) {
        document.exitFullscreen();
      }
      navigate(`/report/${sessionId}`);
    } catch (err) {
      alert("Interview auto-submitted due to violations");
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  };
  
  // ... (useEffect hooks for monitoring are correct)

  // Submit interview function - with camera fix
  const submitInterview = async () => {
    setSubmitting(true);
    setIsTimerRunning(false);

    // **FIX APPLIED HERE**: Stop camera tracks immediately
    if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000"}/api/interview/submit/${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, duration: timer }),
        },
      );

      if (!res.ok) throw new Error("Failed to submit interview");
      localStorage.removeItem(`interview_${sessionId}`);
      if (document.fullscreenElement && !isMobile) {
        document.exitFullscreen();
      }
      navigate(`/report/${sessionId}`);
    } catch (err) {
      alert("Failed to submit interview");
    } finally {
      setSubmitting(false);
    }
  };
  
  // The rest of the component's functions and JSX are correct.
  // I am including the full component code for completeness.

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Timer functionality
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const enterFullscreen = async () => {
    if (isMobile) return true;
    try {
      if (containerRef.current?.requestFullscreen) await containerRef.current.requestFullscreen();
      else if (containerRef.current?.webkitRequestFullscreen) await containerRef.current.webkitRequestFullscreen();
      else if (containerRef.current?.mozRequestFullScreen) await containerRef.current.mozRequestFullScreen();
      setIsFullscreen(true);
      return true;
    } catch (error) {
      return false;
    }
  };

  const exitFullscreen = () => {
    if (isMobile || !document.fullscreenElement) return;
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  };

  const showWarningModal = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
  };

  useEffect(() => {
    if (isMobile) return;
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      if (interviewStarted && !isCurrentlyFullscreen && !submitting) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            autoSubmitInterview();
          } else {
            showWarningModal("You must stay in fullscreen. This is your final warning.");
            setTimeout(() => enterFullscreen(), 3000);
          }
          return newCount;
        });
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [interviewStarted, submitting, isMobile]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && interviewStarted && !submitting) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            autoSubmitInterview();
          } else {
            showWarningModal("Tab switching is not allowed. This is your final warning.");
          }
          return newCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [interviewStarted, submitting]);

  const startInterview = async () => {
    if(!isMobile){
        const success = await enterFullscreen();
        if (!success) {
            alert("Fullscreen mode is required for the interview.");
            return;
        }
    }
    setInterviewStarted(true);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    const initializeCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            alert("Camera access is required. Please enable it and refresh.");
        }
    };
    initializeCamera();
    
    const storedQuestions = localStorage.getItem(`interview_${sessionId}`);
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions);
      setQuestions(parsedQuestions);
      setAnswers(new Array(parsedQuestions.length).fill(""));
    }
    setLoading(false);

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [sessionId]);

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    setCurrentAnswer(value);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentAnswer(answers[currentQuestion + 1] || "");
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setCurrentAnswer(answers[currentQuestion - 1] || "");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0d24]">
        <div className="text-purple-400 text-xl animate-pulse">
          Preparing Interview Environment...
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter">
      {!interviewStarted && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0c0d24] p-4">
          <div className="text-center max-w-2xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient mb-6">
              AI Technical Interview
            </h1>
            <div className="text-sm md:text-base text-gray-300 mb-8 space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
              <p className="font-bold text-white text-lg">Interview Guidelines:</p>
              <ul className="text-left space-y-2 text-gray-400 text-xs md:text-sm">
                {!isMobile && <li>• This interview must be completed in fullscreen mode.</li>}
                <li>• Tab switching is monitored. You will receive 1 warning.</li>
                <li>• After 2 violations, the interview will auto-submit.</li>
                <li>• Ensure your webcam is enabled for monitoring.</li>
                {isMobile && <li>• Please do not switch apps during the interview.</li>}
              </ul>
            </div>
            <button onClick={startInterview} className="rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:opacity-90 transition">
              🚀 Start Interview
            </button>
          </div>
        </div>
      )}
      <div ref={containerRef} className="fixed inset-0 z-50 bg-[#0c0d24] text-white overflow-hidden flex">
        {showWarning && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ WARNING</h2>
              <p className="text-white mb-6">{warningMessage}</p>
              <button onClick={() => setShowWarning(false)} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-400 transition">I Understand</button>
            </div>
          </div>
        )}
        <div className="w-1/3 bg-black/30 p-8 flex flex-col border-r border-white/10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient mb-3">Problem {currentQuestion + 1}</h2>
            <div className="bg-white/5 rounded-lg p-4 text-gray-300 text-base leading-relaxed h-60 overflow-y-auto">
              {questions[currentQuestion]}
            </div>
          </div>
          <div className="mt-auto space-y-6">
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
              <div className="font-mono text-lg bg-red-500/80 px-3 py-1 rounded-md">🔴 {formatTime(timer)}</div>
              <div className="text-sm text-gray-400">Question {currentQuestion + 1}/{questions.length}</div>
              {tabSwitchCount > 0 && <div className="text-sm text-red-400 font-bold">⚠️ {tabSwitchCount}/2</div>}
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 h-30 rounded-lg overflow-hidden border-2 border-gray-600">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Live Monitoring</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col bg-[#0c0d24]">
          <h3 className="text-xl font-semibold text-white mb-4">Code Editor</h3>
          <div className="flex-1 mb-4">
            <textarea
              ref={codeEditorRef}
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="// Write your solution here..."
              className="w-full h-full bg-black/50 text-green-300 p-4 rounded-lg font-mono text-sm resize-none border border-white/20 focus:border-fuchsia-500 focus:outline-none transition"
            />
          </div>
          <div className="flex gap-4">
            <button onClick={previousQuestion} disabled={currentQuestion === 0} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50">← Previous</button>
            {currentQuestion === questions.length - 1 ? (
              <button onClick={submitInterview} disabled={submitting} className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
                {submitting ? "Submitting..." : "✅ Submit & Finish Interview"}
              </button>
            ) : (
              <button onClick={nextQuestion} className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">Next →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

