import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/component/SessionWrapper";
import AuthButton from "./components/AuthButton";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JobPulse",
  description: "Track any Job Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <Toaster position="top-center" />

        {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
