import { useState } from 'react';
import QRCode from 'qrcode.react';
import { generateLNURLAuth } from '../utils/lnurl';
import { toast } from 'react-hot-toast';

const Authlight = () => {
  const [action, setAction] = useState<'login' | 'register' | 'link' | 'auth'>('login');
  
  // Generate the LNURL for authentication
  const lnurl = generateLNURLAuth(action);
 

  return (
    <>
      <div className='bg-white p-4 rounded-md'> <QRCode value={lnurl} size={328} /></div>
      <div className='p-4  text-yellow-500  rounded-md'> <p>Scan this QR code to authenticate with your Lightning wallet.</p></div>
    </>
  );
};

export default Authlight;
