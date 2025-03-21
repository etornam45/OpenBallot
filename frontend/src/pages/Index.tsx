

import { useNavigate } from 'react-router-dom';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import GhanaButton from '@/components/GhanaButton';
import GlassCard from '@/components/GlassCard';
import { ArrowRight, Shield, Lock, BarChart3 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-ghana-green" />,
      title: "Secure",
      description: "Your vote is protected with advanced encryption and verification."
    },
    {
      icon: <Lock className="h-8 w-8 text-ghana-red" />,
      title: "Private",
      description: "Your identity is protected while ensuring voting integrity."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-ghana-gold" />,
      title: "Transparent",
      description: "Real-time results and verification you can trust."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:20px_20px] bg-white" />
        
        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10">
          <OpenBallotLogo size="md" />
          <div className="flex items-center gap-4">
            <GhanaButton 
              variant="black" 
              size="sm" 
              onClick={() => navigate('/login')}
            >
              Login
            </GhanaButton>
          </div>
        </nav>
        
        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight animate-fade-in">
            <span className="text-ghana-red">Secure. </span>
            <span className="text-ghana-gold">Transparent.{' '}</span>
            <span className="text-ghana-green">Democratic.</span>
          </h1>
          
          <p className="text-xl md:text-2xl !text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
            OpenBallot delivers a modern, secure voting experience that ensures every voice is heard and every vote is counted.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-fade-in" style={{animationDelay: '0.2s'}}>
            <GhanaButton 
              variant="red" 
              size="lg" 
              fullWidth 
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 w-max"
            >
              Register Now <ArrowRight size={18} />
            </GhanaButton>
            <GhanaButton 
              variant="gold" 
              size="lg" 
              fullWidth 
              onClick={() => navigate('/login')}
              className='w-max'
            >
              Login
            </GhanaButton>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-16 px-6  bg-foreground/95">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose OpenBallot?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard 
                key={feature.title} 
                className="p-6 animate-fade-in"
                style={{animationDelay: `${0.1 + index * 0.1}s`}}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 bg-black !text-white text-center">
        <div className="max-w-5xl mx-auto">
          {/* <OpenBallotLogo className="mx-auto mb-4 !text-white" /> */}
          <p className="!text-white">© 2023 OpenBallot. Secure electronic voting for the future.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;