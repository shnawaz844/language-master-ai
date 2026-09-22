"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TeacherAgent } from "../../_components/TeacherAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff, Mic, MicOff, Maximize2, Minimize2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedTeacher: TeacherAgent;
  createdOn: string;
};

type messages = {
  role: string;
  text: string;
};

/**
 * TeacherVoiceAgent Component
 *
 * Provides an AI-powered educational voice assistant interface where students can
 * start a voice lesson with an AI teacher agent, interact in real-time,
 * view live transcripts, and generate a learning report.
 */
function TeacherVoiceAgent() {
  const { sessionId } = useParams(); // Get sessionId from route parameters
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>(); // Current session details
  const [callStarted, setCallStarted] = useState(false); // Call connection status
  const [vapiInstance, setVapiInstance] = useState<any>(null); // Instance of Vapi for voice interaction
  const [currentRole, setCurrentRole] = useState<string | null>(null); // Current speaking role (user/assistant)
  const [liveTranscript, setLiveTranscript] = useState<string>(""); // Live transcription text
  const [messages, setMessages] = useState<messages[]>([]); // Finalized chat messages log
  const [loading, setLoading] = useState(false); // Loading state for UI feedback
  const [vapiCallId, setVapiCallId] = useState<string | null>(null); // Vapi call ID for recording retrieval
  const [seconds, setSeconds] = useState(0); // Timer seconds
  const [isEnded, setIsEnded] = useState(false); // Session ended state
  const [isMuted, setIsMuted] = useState(false); // Microphone mute state
  const [isFullscreen, setIsFullscreen] = useState(false); // Browser fullscreen state
  const router = useRouter();
  const { user } = useUser();
  const callActiveRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else if ((containerRef.current as any)?.webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStarted) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStarted]);

  // Auto-scroll inside chat container only (keeps left section & entire page strictly fixed)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, liveTranscript]);

  // Handle Video Playback based on current role (agent speaking)
  useEffect(() => {
    if (videoRef.current) {
      if (currentRole === "assistant") {
        videoRef.current.play().catch((err) => console.log("Video play error:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentRole]);

  const toggleMute = () => {
    if (vapiInstance) {
      vapiInstance.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const formatMessage = (text: string) => {
    if (!text) return text;
    // Split text by sentence-ending punctuation followed by space
    const sentences = text.split(/(?<=[.!?।])\s+/).filter((s) => s.trim().length > 0);

    if (sentences.length <= 1) {
      return <span>{text}</span>;
    }

    return (
      <ul className="space-y-2">
        {sentences.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5 text-sm">•</span>
            <span>{s.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Load session details on component mount or when sessionId changes
  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  // Fetch session detail data from backend API
  const GetSessionDetails = async () => {
    const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
    console.log("Session deatails", result.data);
    setSessionDetail(result.data);
  };

  /**
   * StartCall
   * Initializes and starts the voice call with the AI Subject Teacher Voice Agent
   * using the Vapi SDK and sets up event listeners for call and speech events.
   */
  const StartCall = () => {
    console.log("Starting call", sessionDetail);
    if (!sessionDetail) return;
    setLoading(true);
    setSeconds(0);

    // Initialize Vapi instance with your API key
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    // Configuration for the AI voice agent
    const primaryLanguage = (sessionDetail.selectedTeacher as any)?.primaryLanguage || "English";
    const targetLanguage = (sessionDetail.selectedTeacher as any)?.targetLanguage || sessionDetail.selectedTeacher?.specialist || "Language";
    const level = (sessionDetail.selectedTeacher as any)?.level || "Beginner";

    // Configuration for the AI voice agent
    const VapiAgentConfig = {
      name: `AI ${targetLanguage} Tutor`,

      // Use the teacher's custom greeting/prompt
      firstMessage: sessionDetail.selectedTeacher?.agentPrompt || `Hello! I am your ${targetLanguage} language tutor. Ready to practice?`,

      transcriber: {
        model: "nova-3",
        provider: "deepgram",
        language: primaryLanguage === "Hindi" ? "hi" : "en",
      },

      voice: {
        model: "eleven_turbo_v2_5",
        voiceId: sessionDetail.selectedTeacher?.gender === "male"
          ? process.env.NEXT_PUBLIC_MALE_VOICE_ID!
          : process.env.NEXT_PUBLIC_FEMALE_VOICE_ID!,
        provider: "11labs",
        stability: 0.5,
        similarityBoost: 0.75,
      },

      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are an encouraging, expert native AI Language Tutor teaching ${targetLanguage}.
Student's Primary Language (medium of instruction): ${primaryLanguage}.
Student's Proficiency Level: ${level}.
Session Topic / Notes: ${sessionDetail.notes || "Conversational practice and vocabulary building"}.

Teaching Rules:
1. Explanations & Instruction Language:
   ${primaryLanguage === "Hindi"
     ? "Always explain grammar, word meanings, and guidelines in simple, warm Hindi / Hinglish so the student grasps concepts effortlessly."
     : "Always explain grammar, word meanings, and guidelines in clear, supportive English."}

2. Target Language Practice (${targetLanguage}):
   - Teach practical words, phrases, and conversational exchanges in ${targetLanguage}.
   - Whenever you teach a phrase in ${targetLanguage}, give its meaning in ${primaryLanguage} and ask the student to pronounce or repeat it.
   - Example: "${targetLanguage} me 'Thank you' ko kaise bolte hain? Let's say it together..."

3. Conversational Interaction:
   - Ask only ONE question or phrase at a time.
   - Keep answers short, lively, and conversational (1 to 2 sentences max).
   - If the student answers correctly, praise them.
   - If they make a mistake, gently explain the correction in ${primaryLanguage} and encourage them to try once more.

4. Objective:
   Build the student's spoken confidence and fluency in ${targetLanguage} through active verbal practice.
            `.trim(),
          },
        ],
      },
    };

    //@ts-ignore
    vapi.start(VapiAgentConfig);

    // Event listeners for Vapi voice call lifecycle

    //@ts-ignore - Vapi SDK passes data to event handlers despite type definitions
    vapi.on("call-start", async (data: any) => {
      callActiveRef.current = true;
      setLoading(false);
      setCallStarted(true);
      console.log("Call started event received");
      console.log("Full call-start data:", JSON.stringify(data, null, 2), data);

      // Try to get call ID from the vapi instance itself
      //@ts-ignore
      console.log("Vapi instance properties:", Object.keys(vapi));
      //@ts-ignore
      console.log("Vapi call:", vapi.call);
      //@ts-ignore
      console.log("Vapi callId:", vapi.callId);
      //@ts-ignore
      console.log("Vapi _call:", vapi._call);
      //@ts-ignore
      console.log("Vapi activeCall:", vapi.activeCall);

      // Try to extract call ID from vapi instance
      //@ts-ignore
      const instanceCallId = (vapi as any).call?.callClientId || (vapi as any).call?._callClientId || (vapi as any).call?.id || (vapi as any).callId;
      //@ts-ignore
      console.log("Instance call ID:", instanceCallId, vapi.call);

      if (instanceCallId) {
        setVapiCallId(instanceCallId);
        console.log("✅ Call ID found in vapi instance:", instanceCallId);

        try {
          await axios.post('/api/save-vapi-callid', {
            sessionId: sessionId,
            vapiCallId: instanceCallId
          });
          console.log("✅ Vapi call ID saved to database");
        } catch (error) {
          console.error("❌ Failed to save Vapi call ID:", error);
        }
      } else {
        console.log("⚠️ No call ID found in vapi instance yet, waiting for message events...");
      }
    });

    //@ts-ignore - Vapi SDK passes data to event handlers despite type definitions
    vapi.on("call-end", (data: any) => {
      callActiveRef.current = false;
      setCallStarted(false);
      setVapiInstance(null);
      console.log("Call ended", data);
      if (vapiCallId) {
        console.log("Recording should be available for call ID:", vapiCallId);
      }
    });

    vapi.on("message", (message) => {
      if (!callActiveRef.current) return;

      // Log all messages to debug
      console.log("Vapi message received:", message);

      // Check for end-of-call-report to get recording URL
      if (message.type === "end-of-call-report") {
        console.log("📞 End-of-call-report received:", message);
        //@ts-ignore
        const recordingUrl = message.recordingUrl || message.artifact?.recordingUrl || message.stereoRecordingUrl;

        if (recordingUrl) {
          console.log("✅ Recording URL captured:", recordingUrl);
          // Save recording URL to database
          axios.post('/api/save-recording-url', {
            sessionId: sessionId,
            recordingUrl: recordingUrl
          }).then(() => {
            console.log("✅ Recording URL saved to database");
          }).catch(error => {
            console.error("❌ Failed to save recording URL:", error);
          });
        } else {
          console.log("⚠️ No recording URL in end-of-call-report");
        }
      }

      // Check for call-start message type to get call ID
      if (message.type === "call-start") {
        console.log("Call-start message detected:", message);
        // Try to extract call ID from various possible locations
        //@ts-ignore
        const callId = message.call?.id || message.callId || message.id;
        if (callId) {
          setVapiCallId(callId);
          console.log("✅ Call ID captured from message:", callId);

          // Save the Vapi call ID to the database
          axios.post('/api/save-vapi-callid', {
            sessionId: sessionId,
            vapiCallId: callId
          }).then(() => {
            console.log("✅ Vapi call ID saved to database");
          }).catch(error => {
            console.error("❌ Failed to save Vapi call ID:", error);
          });
        }
      }

      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          // Show live partial transcript while user/assistant is speaking
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          // Add finalized transcript to messages log
          setMessages((prev) => {
            if (prev.length > 0 && prev[prev.length - 1].role === role) {
              const lastMsg = prev[prev.length - 1];
              // Separate out questions into their own bubbles
              const isLastQuestion = lastMsg.text.includes('?');
              const isNewQuestion = transcript.includes('?');

              if (isLastQuestion || isNewQuestion) {
                return [...prev, { role, text: transcript }];
              }

              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMsg,
                text: lastMsg.text + " " + transcript
              };
              return updatedMessages;
            }
            return [...prev, { role, text: transcript }];
          });
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      setCurrentRole("user");
    });
    vapi.on("error", (err) => {
      if (err?.errorMsg === "Meeting has ended") {
        console.log("Meeting already ended, ignoring");
        return;
      }

      console.error("Vapi error:", err);
    });
  };

  /**
   * endCall
   * Ends the ongoing voice call, cleans up listeners, generates
   * a learning report, and redirects the user back to dashboard.
   */
  const endCall = async () => {
    if (!vapiInstance || !callActiveRef.current) {
      router.replace("/dashboard");
      return;
    }

    callActiveRef.current = false;
    // Generate learning report based on chat messages/
    try {
      const result = await GenerateReport();
    } catch (e) {
      console.error("Report generation failed", e);
    }

    // if (!vapiInstance) return;

    // Stop the Vapi call and remove event listeners
    try {
      vapiInstance.stop();
    } catch {
      // call already ended — ignore
      console.log("Meeting already ended, ignoring");
      return;
    }

    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");
    vapiInstance.off("speech-start");
    vapiInstance.off("speech-end");

    setCallStarted(false);
    setVapiInstance(null);

    toast.success("Your language learning report is generated!");

    setIsEnded(true);
    setIsMuted(false);
  };

  /**
   * GenerateReport
   * Sends the collected messages and session details to backend API to
   * create a learning session report.
   */
  const GenerateReport = async () => {
    setLoading(true);
    const result = await axios.post("/api/training-report", {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId: sessionId,
      studentName: user?.fullName || user?.firstName || "Anonymous"
    });

    console.log(result.data);
    setLoading(false);

    return result.data;
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 w-full h-[calc(100vh-3.75rem)] max-h-[calc(100vh-3.75rem)] p-3 sm:p-5 md:p-6 bg-[#e69b6a] rounded-none border-0 overflow-hidden"
    >
      {/* Status bar showing if call is connected */}
      <div className="flex justify-between items-center pb-2 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white text-xs sm:text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <h2 className="p-1 px-2 sm:px-3 border border-white/30 rounded-md flex gap-2 items-center text-white text-xs sm:text-sm bg-black/10 backdrop-blur-sm">
            <Circle
              className={`h-3.5 w-3.5 rounded-full text-white ${
                callStarted ? "bg-green-500 fill-green-500 animate-pulse" : "bg-red-500 fill-red-500"
              }`}
            />
            {callStarted ? "Connected..." : "Not Connected"}
          </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="font-bold text-base sm:text-xl text-white font-mono tracking-wider">
            {formatTime(seconds)}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 px-2 text-white hover:text-white hover:bg-black/20"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main content shows doctor details and conversation */}
      {sessionDetail && (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6 mt-3 md:mt-4 flex-1 min-h-0 h-full max-h-full overflow-hidden">
          {/* Left Side: Avatar & Controls (30%) - Fixed and pinned */}
          <div className="md:col-span-3 flex flex-col items-center bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 h-full max-h-full overflow-y-auto flex-shrink-0">
            <audio id="vapi-dummy-audio" className="hidden" autoPlay playsInline />
            {sessionDetail.selectedTeacher?.gender === "male" ? (
              <video
                ref={videoRef}
                src="/lantaai.mp4"
                loop
                muted
                playsInline
                className={`h-[90px] w-[90px] sm:h-[120px] sm:w-[120px] object-cover rounded-full shadow-md mb-3 sm:mb-4 transition-all duration-300 ${
                  currentRole === "assistant"
                    ? "ring-4 ring-orange-500 animate-ripple scale-105"
                    : ""
                }`}
              />
            ) : sessionDetail.selectedTeacher?.gender === "female" ? (
              <video
                ref={videoRef}
                src="/female.mp4"
                loop
                muted
                playsInline
                className={`h-[90px] w-[90px] sm:h-[120px] sm:w-[120px] object-cover rounded-full shadow-md mb-3 sm:mb-4 transition-all duration-300 ${
                  currentRole === "assistant"
                    ? "ring-4 ring-orange-500 animate-ripple scale-105"
                    : ""
                }`}
              />
            ) : (
              <Image
                src={sessionDetail.selectedTeacher?.image}
                alt={sessionDetail.selectedTeacher?.specialist ?? ""}
                width={120}
                height={120}
                className="h-[90px] w-[90px] sm:h-[120px] sm:w-[120px] object-cover rounded-full shadow-md mb-3 sm:mb-4"
              />
            )}
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
              {sessionDetail.selectedTeacher?.specialist}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 md:mb-6">AI Language Tutor</p>

            {/* Start, End Call, or Dashboard buttons */}
            <div className="w-full mt-auto flex flex-col gap-2.5 sm:gap-3">
              {!callStarted ? (
                !isEnded ? (
                  <Button
                    className="w-full h-12 md:h-14 text-base md:text-lg hover:scale-[1.02] transition-all"
                    onClick={StartCall}
                    disabled={loading}
                  >
                    {loading ? <Loader className="animate-spin mr-2" /> : <PhoneCall className="mr-2" />}
                    Start Call
                  </Button>
                ) : (
                  <Button
                    className="w-full h-12 md:h-14 text-base md:text-lg bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] transition-all"
                    onClick={() => router.replace("/dashboard")}
                    disabled={loading}
                  >
                    Back to Dashboard
                  </Button>
                )
              ) : (
                <>
                  <Button
                    className={`w-full h-12 md:h-14 text-base md:text-lg hover:scale-[1.02] transition-all ${
                      isMuted ? "bg-orange-100 text-orange-600 border-orange-300 hover:bg-orange-200" : ""
                    }`}
                    variant={isMuted ? "outline" : "secondary"}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="mr-2 h-5 w-5 text-orange-500" /> : <Mic className="mr-2 h-5 w-5" />}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>
                  <Button
                    className="w-full h-12 md:h-14 text-base md:text-lg hover:scale-[1.02] transition-all"
                    variant="destructive"
                    onClick={endCall}
                    disabled={loading}
                  >
                    {loading ? <Loader className="animate-spin mr-2" /> : <PhoneOff className="mr-2" />}
                    Disconnect
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Chat Conversation (70%) */}
          <div className="md:col-span-7 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 h-full max-h-full min-h-0 overflow-hidden">
            {/* Show all finalized messages and live transcript */}
            <div
              ref={chatContainerRef}
              className="overflow-y-auto w-full flex-1 flex flex-col scroll-smooth pr-2 sm:pr-4 gap-4 min-h-0"
            >
              {messages.length === 0 && !liveTranscript && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p>No messages yet. Start the call to begin!</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div key={index} className="flex flex-col items-start w-full">
                  <span className="text-sm text-gray-600 mb-1">{msg.role === "user" ? "You" : "Teacher"}</span>
                  <div
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-gray-800 border max-w-[90%] sm:max-w-[85%] ${
                      msg.role === "user" ? "bg-gray-100 border-gray-200" : "bg-red-100 border-red-200"
                    }`}
                  >
                    {msg.role === "user" ? msg.text : formatMessage(msg.text)}
                  </div>
                </div>
              ))}
              {liveTranscript && (
                <div className="flex flex-col items-start w-full">
                  <span className="text-sm text-gray-400 mb-1">{currentRole === "user" ? "You" : "Teacher"}</span>
                  <div
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-gray-800 border max-w-[90%] sm:max-w-[85%] italic ${
                      currentRole === "user" ? "bg-gray-100 border-gray-200" : "bg-red-100 border-red-200"
                    }`}
                  >
                    {currentRole === "user" ? liveTranscript : formatMessage(liveTranscript)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherVoiceAgent;
