import React from 'react';

const Authlight: React.FC = () => {
    const [auturl, setAuthurl] = React.useState<string>('');

    
  const handleLogin = async () => {
    // Generate the LNURL-auth URL
    const baseUrl = 'http://localhost:3000/api/lnurl-auth'; // Update with your domain
    const k1 = generateRandomK1(); // Generate k1
    const url = `${baseUrl}?tag=login&k1=${k1}&action=login`;

    // Display the QR code or link to the user
    return url
 
  };

  // Function to generate k1 (could also be done on the server)
  const generateRandomK1 = (): string => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with LNURL</button>
    </div>
  );
};

export default Authlight;
