"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Welcome, {session.user.name}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={() => signIn("google")}
    >
      Login with Google
    </button>
  );
}
