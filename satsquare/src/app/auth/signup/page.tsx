'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error('Échec de la création de l\'utilisateur');
      }

      const data = await response.json();
      toast.success('Inscription réussi !');

      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/api/auth/signin');
    } catch (error) {
      toast.error('Erreur lors de la création de l\'utilisateur : ' + (error as Error).message);
    }
  };

  return (
    <div className="max-w-md p-8 m-20 mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center my-3">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-center justify-center rounded-md">
            <div className="flex items-center justify-center p-[2em] rounded-full bg-main">
              <FaUser className="text-white scale-150" />
            </div>
            <span className="font-bold text-[#808086] p-4 text-xl">Inscription</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-3">
          <input
            type="email"
            placeholder="E-mail ..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100"
            required
          />
          <input
            type="text"
            placeholder="Pseudo ..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100"
            required
          />
        </div>
        <input
          type="password"
          placeholder="Mot de passe ..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-8 py-3 mt-3 border-none rounded-md shadow outline-none bg-slate-100"
          required
        />
        <button
          type="submit"
          className="w-full bg-action mt-8 px-8 py-3.5 font-bold text-[#6D6B81] rounded-md"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
