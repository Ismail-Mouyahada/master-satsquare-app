 
// app/components/AuthPage.tsx
import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { signIn, useSession } from 'next-auth/react';

const Authlight = () => {
    const [lnurl, setLnurl] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        async function createLnUrl() {
            const response = await fetch('/api/lightning');
            const data = await response.json();
            setLnurl(data.lnurl);
        }

   
            createLnUrl();
      
    }, [session]);

    return (
        <div>
            {lnurl ? <QRCode value={lnurl} /> : 'Please login'}
        </div>
    );
};

export default Authlight;
