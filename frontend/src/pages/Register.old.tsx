
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, Camera, Fingerprint, Key, ArrowLeft, ArrowRight } from 'lucide-react';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import GhanaButton from '@/components/GhanaButton';
import GlassCard from '@/components/GlassCard';
import StepIndicator from '@/components/StepIndicator';
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    dateOfBirth: '',
    biometricCaptured: false
  });

  const steps = ['ID Upload', 'Verification', 'Biometric'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    toast("File Uploaded",{
      description: `${file.name} has been uploaded successfully.`,
      duration: 3000,
    });
  };

  const extractInformation = () => {
    // Simulate extraction with mock data
    setTimeout(() => {
      setFormData({
        ...formData,
        fullName: 'John Kofi Agyemang',
        idNumber: 'GHA-293847156',
        dateOfBirth: '1985-06-15'
      });
      
      toast("Information Extracted",{
        description: "Your ID information has been successfully extracted.",
        duration: 3000,
      });
      
      setStep(2);
    }, 1500);
  };

  const handleVerification = () => {
    setTimeout(() => {
      toast("Verification Complete", {
        description: "Your identity has been verified successfully.",
        duration: 3000,
      });
      
      setStep(3);
    }, 1500);
  };

  const handleBiometric = () => {
    setFormData({
      ...formData,
      biometricCaptured: true
    });
    
    setTimeout(() => {
      toast("Registration Complete", {
        description: "Your account has been created successfully.",
        duration: 3000,
      });
      
      navigate('/dashboard');
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white  py-4 px-6">
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
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Create Your Account</h1>
          
          <StepIndicator 
            steps={steps} 
            currentStep={step}
            className="mb-8" 
          />
          
          <GlassCard className="p-8 animate-fade-in">
            {/* Step 1: ID Upload */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Upload Your ID</h2>
                <p className="text-gray-600 mb-6">
                  Please upload a clear photo of your Ghana Card or Voter ID.
                </p>
                
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                    dragActive 
                      ? 'border-ghana-gold bg-ghana-gold/5' 
                      : uploadedFile 
                      ? 'border-ghana-green bg-ghana-green/5' 
                      : 'border-gray-300 hover:border-ghana-gold'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center">
                    {uploadedFile ? (
                      <>
                        <CheckCircle className="h-12 w-12 text-ghana-green mb-4" />
                        <p className="text-ghana-green font-medium mb-2">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          File uploaded successfully
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="font-medium mb-2">
                          Drag and drop your ID, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPG, PNG, PDF up to 5MB
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    {!uploadedFile && (
                      <label htmlFor="file-upload">
                        <GhanaButton 
                          variant="gold" 
                          size="sm" 
                          className="mt-4 cursor-pointer"
                          type="button"
                        >
                          Select File
                        </GhanaButton>
                      </label>
                    )}
                  </div>
                </div>
                
                {uploadedFile && (
                  <div className="flex justify-center">
                    <GhanaButton 
                      variant="green" 
                      onClick={extractInformation}
                      className="mt-4"
                    >
                      Extract Information
                    </GhanaButton>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 2: Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Verify Your Information</h2>
                <p className="text-gray-600 mb-6">
                  Please verify that your details are correct.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <GhanaButton 
                    variant="black" 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={16} className="mr-1" /> Back
                  </GhanaButton>
                  <GhanaButton 
                    variant="green" 
                    onClick={handleVerification}
                  >
                    Continue <ArrowRight size={16} className="ml-1" />
                  </GhanaButton>
                </div>
              </div>
            )}
            
            
            {/* Step 4: Biometric */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Biometric Verification</h2>
                <p className="text-gray-600 mb-6">
                  Please provide your biometric data to complete the registration process.
                </p>
                
                <div className="flex flex-col items-center space-y-8 py-6">
                  {formData.biometricCaptured ? (
                    <div className="text-center">
                      <div className="flex justify-center">
                        <CheckCircle className="h-16 w-16 text-ghana-green mb-4" />
                      </div>
                      <p className="text-ghana-green font-medium text-lg">
                        Biometric data captured successfully!
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-32 h-32 rounded-full border-2 border-ghana-gold flex items-center justify-center bg-ghana-gold/5 animate-pulse-soft">
                        <Fingerprint className="h-16 w-16 text-ghana-gold" />
                      </div>
                      <p className="text-center text-sm text-gray-600">
                        Place your finger on the fingerprint scanner
                      </p>
                      <GhanaButton 
                        variant="gold" 
                        onClick={handleBiometric}
                        className="mt-4"
                      >
                        Capture Biometric
                      </GhanaButton>
                    </>
                  )}
                </div>
                
                <div className="flex justify-between mt-8">
                  <GhanaButton 
                    variant="black" 
                    onClick={() => setStep(3)}
                    disabled={formData.biometricCaptured}
                  >
                    <ArrowLeft size={16} className="mr-1" /> Back
                  </GhanaButton>
                  {formData.biometricCaptured && (
                    <GhanaButton 
                      variant="green" 
                      onClick={() => navigate('/dashboard')}
                    >
                      Complete Registration <ArrowRight size={16} className="ml-1" />
                    </GhanaButton>
                  )}
                </div>
              </div>
            )}
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

export default Register;