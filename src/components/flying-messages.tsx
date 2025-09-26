import { motion } from 'motion/react';

interface MessageDot {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  delay: number;
  platform: string;
}

export function FlyingMessages() {
  const messages: MessageDot[] = [
    { id: 1, x: 10, y: 20, targetX: 90, targetY: 80, delay: 0, platform: 'WhatsApp' },
    { id: 2, x: 80, y: 10, targetX: 20, targetY: 90, delay: 1, platform: 'Slack' },
    { id: 3, x: 5, y: 70, targetX: 95, targetY: 30, delay: 2, platform: 'Email' },
    { id: 4, x: 90, y: 60, targetX: 10, targetY: 40, delay: 3, platform: 'CRM' },
    { id: 5, x: 30, y: 5, targetX: 70, targetY: 95, delay: 1.5, platform: 'Jira' },
    { id: 6, x: 75, y: 85, targetX: 25, targetY: 15, delay: 2.5, platform: 'Monday' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          className="absolute w-2 h-2 bg-green-400 rounded-full opacity-60"
          style={{
            left: `${message.x}%`,
            top: `${message.y}%`,
          }}
          animate={{
            x: [`0%`, `${(message.targetX - message.x) * 4}px`],
            y: [`0%`, `${(message.targetY - message.y) * 4}px`],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 6,
            delay: message.delay,
            repeat: Infinity,
            repeatDelay: 2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
      
      {/* Additional wave-like paths */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-40"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + i * 15}%`,
          }}
          animate={{
            x: [0, 100, 200, 300],
            y: [0, -20, 20, -10],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 8,
            delay: i * 0.5,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}