import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FlyingMessages } from './flying-messages';

const targets = [
  {
    word: 'Businesses',
    features: [
      '📊 Unified business dashboard',
      '🤖 AI filters to block spam', 
      '📩 Route leads where you want (WhatsApp, Email, CRM)',
      '⚡ Automate follow-ups & track opportunities'
    ]
  },
  {
    word: 'Developers',
    features: [
      '🔗 One API for all platforms',
      '🛠️ Build custom social & workflow apps',
      '🚨 Auto-create bugs in Jira/Monday',
      '⚡ Real-time Slack/Email automation'
    ]
  },
  {
    word: 'Individuals',
    features: [
      '📱 Manage all your platforms in one hub',
      '🤖 Automate likes, comments & replies',
      '🗓️ Schedule posts everywhere',
      '⚡ Personal automations for daily tasks'
    ]
  }
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % targets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-screen relative overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rotate-45 transform -translate-x-48 -translate-y-48"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100 to-transparent rotate-45 transform translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100 to-transparent rotate-45 transform -translate-x-48 translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-100 to-transparent rotate-45 transform translate-x-48 translate-y-48"></div>
        </div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        {/* Flying Messages Animation */}
        <FlyingMessages />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center p-8 pt-24">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left Side - Animated Headline */}
            <div className="space-y-4">
              <div className="overflow-hidden">
                <p className="text-lg text-neutral-600 font-medium mb-2">
                  Palactix for
                </p>
                <div className="relative h-24 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={currentIndex}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      transition={{ 
                        duration: 1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="absolute inset-0 text-6xl font-bold text-[#2ea44f] uppercase"
                    >
                      {targets[currentIndex].word}
                    </motion.h1>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Side - Feature Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ 
                      duration: 1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.2
                    }}
                    className="bg-white p-8 shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow duration-300 min-h-96"
                  >
                    <h3 className="text-xl font-bold text-neutral-900 mb-6">
                      For {targets[currentIndex].word}
                    </h3>
                    
                    <div className="space-y-4">
                      {targets[currentIndex].features.map((feature, featureIndex) => (
                        <motion.div
                          key={`${currentIndex}-${featureIndex}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.4,
                            delay: 0.5 + (featureIndex * 0.1),
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-4 py-3 border border-neutral-200 text-neutral-700 hover:shadow-sm transition-all duration-200"
                        >
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* CTA Section integrated into hero */}
          <div className="text-center">
            <p className="text-xl text-neutral-700 mb-8">
              Be the first to experience Palactix.
            </p>
            
            <div className="bg-white p-6 border border-neutral-200 shadow-lg max-w-lg mx-auto">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");
    setIsSuccess(false);

    const res = await fetch("/api/join-waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setIsLoading(false);
    
    if (data.success) {
      setStatus("✅ Joined successfully!");
      setIsSuccess(true);
      setEmail(""); // Clear email on success
    } else {
      setStatus("❌ " + data.error);
      setIsSuccess(false);
    }

    // Hide status after 4 seconds
    setTimeout(() => {
      setStatus("");
    }, 4000);
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-neutral-700"
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#2ea44f] hover:bg-[#2ea44f]/90 text-white px-6 py-2 font-medium transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining...
            </div>
          ) : (
            "Join the Waitlist"
          )}
        </Button>
      </form>
      {status && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`text-sm text-center py-2 px-3 rounded ${
            isSuccess 
              ? 'text-green-700 bg-green-50 border border-green-200' 
              : 'text-red-700 bg-red-50 border border-red-200'
          }`}
        >
          {status}
        </motion.p>
      )}
    </div>
  );
}