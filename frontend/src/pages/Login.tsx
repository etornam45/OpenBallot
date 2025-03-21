import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Camera, Wallet } from 'lucide-react';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import GhanaButton from '@/components/GhanaButton';
import GlassCard from '@/components/GlassCard';
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState({
    voterId: '',
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [webcamError, setWebcamError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [metamaskError, setMetamaskError] = useState('');

  // Webcam setup
  useEffect(() => {
    let stream: MediaStream;
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setWebcamError('Could not access webcam. Please enable camera permissions.');
      }
    };

    startWebcam();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);


  useEffect(() => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setFormData(prev => ({ ...prev, image: imageData }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.voterId) {
      toast.error("Please enter your Voter ID");
      return;
    }

    if (!formData.image) {
      toast.error("Please capture your face image");
      return;
    }

    setIsLoading(true);

    try {
      const formPayload = new FormData();
      const res = await fetch(formData.image);
      const image = await res.blob();

      formPayload.append('voter_id', formData.voterId);
      formPayload.append("image", image, `image.jpeg`);

      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        body: formPayload,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      setShowWalletConnect(true);
      toast.success("Verification successful! Connect your wallet");
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


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
        handleProceed()
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

  const handleProceed = () => {
    navigate('/voting/1');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white py-4 px-6">
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

      <main className="flex-1 py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          {!showWalletConnect ? (
            <GlassCard className="p-8 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Voter Login</h1>
                <p className="text-gray-600 mt-2">
                  Verify your identity to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="voterId">Voter ID</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="voterId"
                      name="voterId"
                      value={formData.voterId}
                      onChange={handleInputChange}
                      className="pl-10 w-full"
                      placeholder="Enter your Voter ID"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Facial Verification</Label>
                  {webcamError ? (
                    <div className="text-red-600 text-sm">{webcamError}</div>
                  ) : (
                    <>
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-ghana-gold">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        {formData.image && (
                          <img
                            src={formData.image}
                            alt="Capture preview"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <GhanaButton
                        variant="gold"
                        size="sm"
                        type="button"
                        onClick={captureImage}
                        className="w-full"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {formData.image ? "Recapture Image" : "Capture Face"}
                      </GhanaButton>
                    </>
                  )}
                </div>

                <GhanaButton
                  variant="red"
                  size="lg"
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Login"}
                </GhanaButton>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Need help?{' '}
                  <a
                    href="/support"
                    className="text-ghana-green hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/support');
                    }}
                  >
                    Contact support
                  </a>
                </p>
              </div>
            </GlassCard>
          ) : (
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
                      onClick={() => handleProceed()}
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
          )}
        </div>
      </main>

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

export default Login;