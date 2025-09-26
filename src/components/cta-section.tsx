import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function CTASection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist signup
    console.log('Waitlist signup:', email);
    setEmail('');
  };

  return (
    <section className="bg-neutral-50 py-16 px-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xl text-neutral-700 mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Be the first to experience Palactix.
        </p>
        
        <div className="bg-white p-6 rounded-full border border-neutral-200 shadow-lg max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-neutral-700"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              required
            />
            <Button
              type="submit"
              className="bg-[#2ea44f] hover:bg-[#2ea44f]/90 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Join the Waitlist
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}