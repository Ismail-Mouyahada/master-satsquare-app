'use client';

import Image from 'next/image';
import logo from '@/assets/logo-header.png';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Signed in successfully!');
      router.push('/'); // Redirect to homepage or any other page
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      <Image src={logo} className="mb-6" alt="logo" />

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold">Sign In</h1>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
}
