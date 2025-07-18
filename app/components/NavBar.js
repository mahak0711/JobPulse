// components/Navbar.tsx
'use client'
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between p-4 bg-gray-100 shadow">
      <span className="text-xl font-semibold">MyApp</span>
      <div>
        {session ? (
          <>
            <span className="mr-4">Welcome, {session.user?.name}</span>
            <button onClick={() => signOut()} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <button onClick={() => signIn()} className="bg-blue-500 text-white px-3 py-1 rounded">Login</button>
        )}
      </div>
    </nav>
  );
}
