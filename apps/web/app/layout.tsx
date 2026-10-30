import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Caption Studio | The All-in-One AI Powered Creator Studio",
  description:
    "Transcribe, style, animate, and clip your talking videos in seconds. Viral captions, karaoke animations, 60+ languages, and studio audio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0c0d11] text-[#f1f3f7] antialiased selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
