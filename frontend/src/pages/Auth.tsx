import React, { useState } from "react";

// Step 1: Voter Registration Form
const RegistrationForm = ({ onNext }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [voterId, setVoterId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send this data to your backend.
    onNext({ name, email, voterId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Voter Registration</h2>
      <div>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Voter ID"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
          required
        />
      </div>
      <button type="submit">Continue</button>
    </form>
  );
};

// Step 2: Biometric Registration using WebAuthn
const BiometricRegistration = ({ onNext, registrationData }) => {
  const handleBiometricRegistration = async () => {
    // Generate a random challenge – in production, get this from your server.
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // Note: In a real-world scenario, user.id should be generated and stored on your backend.
    const publicKeyOptions = {
      challenge,
      rp: { name: "Voter Portal" },
      user: {
        // For demo purposes only; generate a proper unique ID in production.
        id: Uint8Array.from("unique-user-id", (c) => c.charCodeAt(0)),
        name: registrationData.email,
        displayName: registrationData.name,
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256 algorithm
      authenticatorSelection: {
        residentKey: "required", // Enables passkey functionality for multi-device use
        userVerification: "required",
      },
      timeout: 60000,
      attestation: "none",
    };

    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      });
      console.log("Biometric credential created:", credential);
      // In production, send credential.response to your server for verification and storage.
      onNext(credential);
    } catch (err) {
      console.error("Biometric registration failed:", err);
      alert("Biometric registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Biometric Verification</h2>
      <p>
        Use your device's biometric sensor (e.g., fingerprint, Face ID) to
        register your biometrics.
      </p>
      <button onClick={handleBiometricRegistration}>
        Register Biometrics
      </button>
    </div>
  );
};

// Step 3: Voter ID Linking Form
const VoterIDLinking = ({ onNext, registrationData, biometricData }) => {
  const handleLinking = (e) => {
    e.preventDefault();
    // Here, link the voter data with the biometric credential.
    // Typically, you'd send registrationData and biometricData to your server.
    console.log("Linking voter ID:", registrationData, biometricData);
    onNext();
  };

  return (
    <form onSubmit={handleLinking}>
      <h2>Link Voter ID</h2>
      <p>Please confirm your voter details before proceeding:</p>
      <ul>
        <li>
          <strong>Name:</strong> {registrationData.name}
        </li>
        <li>
          <strong>Email:</strong> {registrationData.email}
        </li>
        <li>
          <strong>Voter ID:</strong> {registrationData.voterId}
        </li>
      </ul>
      <button type="submit">Link Voter ID</button>
    </form>
  );
};

// Step 4: Login Form using Biometric Authentication
const LoginForm = () => {
  const handleLogin = async () => {
    // Generate a challenge for login – in production, this should come from your server.
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // The allowCredentials array would normally include the credential ID stored on your server.
    const publicKeyOptions = {
      challenge,
      timeout: 60000,
      userVerification: "required",
      // allowCredentials: [{
      //   id: <stored credential id as Uint8Array>,
      //   type: "public-key",
      //   transports: ["internal"]
      // }],
    };

    try {
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyOptions,
      });
      console.log("Authentication assertion:", assertion);
      // Send assertion.response to your server to verify the login.
      alert("Login successful!");
    } catch (err) {
      console.error("Biometric login failed:", err);
      alert("Biometric login failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <p>Authenticate using your registered biometrics:</p>
      <button onClick={handleLogin}>Login with Biometrics</button>
    </div>
  );
};

// Main App Component to drive the multi-step process
const Auth = () => {
  const [step, setStep] = useState(1);
  const [registrationData, setRegistrationData] = useState(null);
  const [biometricData, setBiometricData] = useState(null);

  // nextStep handler passes data from one step to the next.
  const nextStep = (data) => {
    if (step === 1) {
      setRegistrationData(data);
      setStep(2);
    } else if (step === 2) {
      setBiometricData(data);
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc" }}>
      {step === 1 && <RegistrationForm onNext={nextStep} />}
      {step === 2 && registrationData && (
        <BiometricRegistration onNext={nextStep} registrationData={registrationData} />
      )}
      {step === 3 && registrationData && biometricData && (
        <VoterIDLinking
          onNext={nextStep}
          registrationData={registrationData}
          biometricData={biometricData}
        />
      )}
      {step === 4 && <LoginForm />}
    </div>
  );
};

export default Auth;
