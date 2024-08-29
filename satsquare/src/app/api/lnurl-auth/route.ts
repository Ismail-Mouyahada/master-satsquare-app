import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import * as secp256k1 from 'secp256k1';

// Example handler for GET requests
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { tag, k1, action, sig, key } = req.query;

    // Validate query parameters
    if (tag !== 'login' || !k1 || !action) {
      return res.status(400).json({ status: 'ERROR', reason: 'Invalid parameters' });
    }

    // Handle LNURL-auth verification
    try {
      const k1Buffer = Buffer.from(k1 as string, 'hex');
      const keyBuffer = Buffer.from(key as string, 'hex');
      const sigBuffer = Buffer.from(sig as string, 'hex');

      // Verify the signature here (example using secp256k1)
      const valid = verifySignature(k1Buffer, keyBuffer, sigBuffer);

      if (valid) {
        return res.status(200).json({ status: 'OK' });
      } else {
        return res.status(401).json({ status: 'ERROR', reason: 'Invalid signature' });
      }
    } catch (error) {
      return res.status(500).json({ status: 'ERROR', reason: 'Internal server error' });
    }
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Function for signature verification
function verifySignature(k1: Buffer, pubKey: Buffer, sig: Buffer): boolean {
  return secp256k1.ecdsaVerify(
    new Uint8Array(sig),
    new Uint8Array(k1),
    new Uint8Array(pubKey)
  );
}
