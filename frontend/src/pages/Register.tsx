import GhanaButton from '@/components/GhanaButton';
import OpenBallotLogo from '@/components/OpenBallotLogo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    voterId: '',
    images: [] as File[]
  });
  const [errors, setErrors] = useState({});
  const [webcamActive, setWebcamActive] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const navigate = useNavigate()

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      // Clean up webcam stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.voterId.trim()) {
      newErrors.voterId = 'Voter ID is required';
    } else if (!/^[A-Z0-9]{10,12}$/i.test(formData.voterId.trim())) {
      newErrors.voterId = 'Please enter a valid Voter ID';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2);
      startWebcam();
    }
  };

  const handleStep2Next = () => {
    if (formData.images.length >= 2) {
      setStep(3);
      stopWebcam();
    } else {
      setErrors({ images: 'Please capture two images' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startWebcam = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setWebcamActive(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setErrors({ webcam: 'Error accessing webcam. Please check your camera permissions.' });
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setWebcamActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && webcamActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL('image/jpeg');

      if (formData.images.length < 3) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageDataUrl]
        }));
        setErrors(prev => ({ ...prev, images: null }));
      }
    }
  };



  const handleConfirm = async () => {
    try {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append('name', formData.fullName);
      formDataToSend.append('voter_id', formData.voterId.toString());

      // Verify and append image files
      // console.log(formData.images)
      if (formData.images && formData.images.length > 0) {
        for (const [index, imageFile] of formData.images.entries()) {
          // Ensure we have a valid File object
          console.log(imageFile)
          const response = await fetch(imageFile);
          const blob = await response.blob();
          formDataToSend.append(
            'images',
            blob,
            `image-${index}.jpeg`
          );
        }
      }

      // Submit to server
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include' // Include cookies if needed
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Submission failed');
      }

      console.log('Submission successful:', responseData);
      // Handle successful submission
      navigate("/login")

    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show to user)
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      voterId: '',
      images: []
    });
    setStep(1);
    setRegistrationComplete(false);
    setErrors({});
  };

  return (
    <div className='min-h-screen flex flex-col h-full'>
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

      <div className="h-full flex-1 bg-white flex flex-col items-center justify-center p-4">

        <div className="w-full max-w-md">

          {registrationComplete ? (
            <div className="bg-white  rounded-lg p-6 text-center">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">Registration Complete!</h2>
              <p className="text-gray-700 mb-6">Thank you for registering with OpenBallot.</p>
              <button
                onClick={resetForm}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
              >
                Register Another User
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-300 rounded-lg p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-green-600 mb-6">Enter Your Details</h2>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs italic mt-1">{errors.fullName}</p>}
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="voterId">
                      Voter ID
                    </label>
                    <input
                      id="voterId"
                      name="voterId"
                      type="text"
                      value={formData.voterId}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border ${errors.voterId ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                      placeholder="Enter your voter ID"
                    />
                    {errors.voterId && <p className="text-red-500 text-xs italic mt-1">{errors.voterId}</p>}
                  </div>
                  <Button
                    onClick={handleStep1Next}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                  >
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-green-600 mb-6">Capture Your Face</h2>
                  <div className="mb-4">
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto"
                      />
                    </div>

                    {errors.webcam && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{errors.webcam}</p>
                      </div>
                    )}

                    <Button
                      onClick={captureImage}
                      disabled={!webcamActive || formData.images.length >= 3}
                      className={`w-full ${!webcamActive || formData.images.length >= 3
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-yellow-500 hover:bg-yellow-600'
                        } text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 transition duration-150`}
                    >
                      {formData.images.length >= 3 ? 'Three images captured' : 'Capture Image'}
                    </Button>

                    {errors.images && <p className="text-red-500 text-xs italic mb-2">{errors.images}</p>}

                    <div className="flex justify-center space-x-4 mb-6">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="border border-gray-300 rounded overflow-hidden w-full aspect-square">
                          <img src={img} alt={`Captured image ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {Array(3 - formData.images.length).fill(0).map((_, idx) => (
                        <div key={`empty-${idx}`} className="border border-gray-300 rounded bg-gray-100 w-full aspect-square flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Image {formData.images.length + idx + 1}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={() => {
                          setStep(1);
                          stopWebcam();
                        }}
                        className="w-1/2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleStep2Next}
                        className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-green-600 mb-6">Confirm Your Details</h2>
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold text-black">{formData.fullName}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Voter ID</p>
                      <p className="font-semibold text-black">{formData.voterId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Captured Images</p>
                      <div className="flex space-x-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="border border-gray-300 rounded overflow-hidden w-24 h-24">
                            <img src={img} alt={`Captured image ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => {
                        setStep(2);
                        startWebcam();
                      }}
                      className="w-1/2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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

export default RegistrationPage;