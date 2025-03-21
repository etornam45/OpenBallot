import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Camera } from 'lucide-react';
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
      toast("Error", {
        description: "Please enter your Voter ID",
        duration: 3000,
      });
      return;
    }

    if (!formData.image) {
      toast("Error", {
        description: "Please capture your face image",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    const _formData = new FormData()

    const res = await fetch(formData.image);
    const image = await res.blob();

    _formData.append('voter_id', formData.voterId)
    _formData.append("image", image, `image.jpeg`)

    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      body: _formData,
      credentials: 'include' // Include cookies if needed
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Submission failed');
    }
    console.log('Submission successful:', responseData);

    setIsLoading(false);
    toast("Login Successful", {
      description: "Welcome to OpenBallot!",
      duration: 3000,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
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

export default Login;