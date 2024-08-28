import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/utils/lnurl';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const k1 = url.searchParams.get('k1');
  const sig = url.searchParams.get('sig');
  const key = url.searchParams.get('key');

  if (!k1 || !sig || !key) {
    return NextResponse.json({ status: 'ERROR', reason: 'Invalid query parameters' }, { status: 400 });
  }

  // Replace with your actual public key
  const publicKeyHex =   process.env.NEXT_PUBLIC_LNURL_AUTH_PUBLIC_KEY || '02c3b844b8104f0c1b15c507774c9ba7fc609f58f343b9b149122e944dd20c9362';

  const isSignatureValid = verifySignature(k1, publicKeyHex, sig);

  if (isSignatureValid) {
    // Handle successful authentication (e.g., create a session)
    return NextResponse.json({ status: 'OK' });
  } else {
    return NextResponse.json({ status: 'ERROR', reason: 'Invalid signature' }, { status: 400 });
  }
}
