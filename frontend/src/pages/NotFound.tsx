
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GhanaButton from '@/components/GhanaButton';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6">
        <div className="max-w-5xl mx-auto">
          <OpenBallotLogo />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="text-center max-w-md animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 text-ghana-red">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <GhanaButton 
            variant="black" 
            size="lg" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} /> Return to Home
          </GhanaButton>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2023 OpenBallot. Secure electronic voting for the future.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;