"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      setSuccessMessage("User created successfully!");
      setErrorMessage("");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push(`/api/auth/signin`);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Error creating user: " + error);
    }
  };

  return (
    <div className="mx-auto max-w-md p-8 bg-white rounded-lg shadow-md m-20">
      <div className="flex items-center justify-center my-3">
        <div className="flex items-center space-x-2 ">


          <div className="rounded-md flex flex-col justify-center items-center">
       
              <div className="flex items-center justify-center p-[2em] rounded-full bg-[#4145c1]">
                <FaUser className="text-white scale-150" />
              </div>
         
            <span className="font-bold text-[#808086] p-4 text-xl">Inscription</span>
          </div>


        </div>
      </div>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1  gap-3">
    <input
          type="email"
          placeholder="E-mail ..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-8 py-3 border-none shadow bg-slate-100 rounded-md outline-none"
          required
        />
        <input
          type="text"
          placeholder="Pseudo ..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-8 py-3 border-none shadow bg-slate-100 rounded-md outline-none"
          required
        />
    </div>
        <input
          type="password"
          placeholder="Mot de passe ..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-8 mt-3 py-3 border-none shadow bg-slate-100 rounded-md outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#F8D99B] mt-8 px-8 py-3.5 font-bold text-[#6D6B81] rounded-md"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
