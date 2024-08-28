import crypto from 'crypto';
import * as secp256k1 from 'secp256k1';
import { Buffer } from 'buffer';

export const verifySignature = (k1: string, pubKeyHex: string, signatureHex: string): boolean => {
  const k1Buffer = new Uint8Array(Buffer.from(k1, 'hex'));
  const pubKeyBuffer = new Uint8Array(Buffer.from(pubKeyHex, 'hex'));
  const sigBuffer = new Uint8Array(Buffer.from(signatureHex, 'hex'));

  if (!secp256k1.publicKeyVerify(pubKeyBuffer)) {
    return false;
  }

  return secp256k1.ecdsaVerify(sigBuffer, k1Buffer, pubKeyBuffer);
}
 
export const generateRandomK1 = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
 
export const generateLNURLAuth = (action: 'login' | 'register' | 'link' | 'auth'): string => {
  const k1 = generateRandomK1();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL+'/lightning';  
  return `${baseUrl}?tag=login&k1=${k1}&action=${action}`;
};
