import { bech32 } from 'bech32';
import * as secp256k1 from 'secp256k1';
import { Buffer } from 'buffer';

// Convert Buffer to Uint8Array
const bufferToUint8Array = (buffer: Buffer): Uint8Array => {
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};

// Verify the signature
export const verifySignature = (k1: string, pubKeyHex: string, signatureHex: string): boolean => {
  const k1Buffer = Buffer.from(k1, 'hex');
  const pubKeyBuffer = Buffer.from(pubKeyHex, 'hex');
  const sigBuffer = Buffer.from(signatureHex, 'hex');

  // Convert Buffer to Uint8Array
  const k1Uint8 = bufferToUint8Array(k1Buffer);
  const pubKeyUint8 = bufferToUint8Array(pubKeyBuffer);
  const sigUint8 = bufferToUint8Array(sigBuffer);

  // Ensure the public key is valid
  if (!secp256k1.publicKeyVerify(pubKeyUint8)) {
    return false;
  }

  return secp256k1.ecdsaVerify(sigUint8, k1Uint8, pubKeyUint8);
};

// Encode a URL into Bech32 format with Base32 encoding
export const encodeLNURL = (url: string): string => {
  const data = Buffer.from(url, 'utf-8');
  const dataUint8Array = bufferToUint8Array(data);
  let words = bech32.toWords(dataUint8Array);

  if (words.length > 90) {
    throw new Error('Data exceeds maximum length for Bech32 encoding');
  }

  while (words.length < 90) {
    words.push(0); // Padding
  }

  return bech32.encode('LNURL', words);
};

// Decode a Bech32 encoded LNURL
export const decodeLNURL = (lnurl: string): string => {
  const { words } = bech32.decode(lnurl);
  const dataUint8Array = new Uint8Array(bech32.fromWords(words));
  const dataBuffer = Buffer.from(dataUint8Array);
  return dataBuffer.toString('utf-8');
};
