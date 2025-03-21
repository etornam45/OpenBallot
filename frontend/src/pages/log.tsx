import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import GhanaButton from '@/components/GhanaButton';
import GlassCard from '@/components/GlassCard';
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Check if wallet is already connected
  useEffect(() => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const connectMetaMask = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      toast.error("MetaMask Not Found", {
        description: "Please install MetaMask browser extension to continue."
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);
      
      // Store wallet address
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('userName', 'Voter');
      
      setIsLoading(false);
      
      toast.success("Wallet Connected", {
        description: "Your MetaMask wallet has been successfully connected."
      });
      
      // Short delay before redirect for better UX
      setTimeout(() => {
        navigate(`/dashboard?walletAddress=${address}`);
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      toast.error("Connection Failed", {
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again."
      });
    }
  };

  const handleDisconnectWallet = () => {
    setWalletAddress('');
    localStorage.removeItem('walletAddress');
    toast("Wallet Disconnected", {
      description: "Your wallet has been disconnected."
    });
  };

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <GhanaButton
              variant="black"
              size="sm"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </GhanaButton>
            <OpenBallotLogo />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <GlassCard className="p-8 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-gray-600 mt-2">
                Sign in to access your voting portal
              </p>
            </div>

            <div className="space-y-6 mt-6">
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Connect your MetaMask wallet to access the platform securely with your digital identity.
                </p>
              </div>

              {walletAddress ? (
                <div className="text-center space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center justify-center gap-2">
                    <Wallet className="h-5 w-5 text-ghana-green" />
                    <p className="font-mono text-sm">{formatWalletAddress(walletAddress)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <GhanaButton
                      variant="green"
                      onClick={() => navigate(`/dashboard?walletAddress=${walletAddress}`)}
                      disabled={isLoading}
                    >
                      Continue
                    </GhanaButton>
                    
                    <GhanaButton
                      variant="black"
                      onClick={handleDisconnectWallet}
                      disabled={isLoading}
                    >
                      Disconnect
                    </GhanaButton>
                  </div>
                </div>
              ) : (
                <GhanaButton
                  variant="gold"
                  size="lg"
                  fullWidth
                  onClick={connectMetaMask}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    "Connecting..."
                  ) : (
                    <>
                      <Wallet size={18} />
                      Connect MetaMask
                    </>
                  )}
                </GhanaButton>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-ghana-green hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  Register now
                </a>
              </p>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} OpenBallot. Secure electronic voting for the future.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;