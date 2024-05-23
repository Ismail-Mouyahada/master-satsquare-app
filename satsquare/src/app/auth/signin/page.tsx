'use client';

import Image from 'next/image';
import logo from '@/assets/logo-header.png';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaConnectdevelop, FaSignInAlt } from 'react-icons/fa';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Sign-in attempt:', { email, password });

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        console.log('Sign-in result:', result);

        if (result?.error) {
            toast.error("la connexion a echouée, vos identifiants sont invalides ou expirés.");
        } else {
            toast.success('Connecté avec succès !');
            router.push('/profile');
        }
    };

    return (
        <section className="p-8 mx-auto bg-white rounded-lg shadow-md ">

            <div className="rounded-lg ">
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-[#4145c1] p-8 rounded-full">
                        <FaConnectdevelop className="text-5xl text-white" />
                    </div>
                </div>

                <form onSubmit={handleSignIn} className='py-8 '>
                    <div className="mb-4">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
                            required
                        />
                    </div>

                    <button type="submit" className="outline-none ring-[#6a6b74!important] font-bold w-full p-4 mt-4 rounded-md bg-[#F8D99B] hover:bg-[#c9aa6c!important] text-[#6a6b74]  "> Se connecter</button>

                </form>
            </div>
        </section>
    );
}