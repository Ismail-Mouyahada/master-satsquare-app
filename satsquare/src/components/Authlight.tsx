// components/LNURLAuth.tsx
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";






const LNURLAuth: React.FC = () => {
  const [lnurl, setLnurl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLnurl = async () => {
      const response = await fetch("/api/auth/lnurl-auth");
      const data = await response.json();
      setLnurl(data.lnurl);
    };

    fetchLnurl();
  }, []);

  return (
    <div>
      {lnurl ? (
        <QRCode value={lnurl} size={256} level={"H"} includeMargin={true} />
      ) : (
        <p>Loading QR code...</p>
      )}
    </div>
  );
};

export default LNURLAuth;
