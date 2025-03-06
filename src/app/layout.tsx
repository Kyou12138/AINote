import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// fr-FR locale is imported as frFR
import { zhCN } from "@clerk/localizations";
import Provider from "@/components/Provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AI 笔记本",
    description: "AI 笔记本",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider localization={zhCN}>
            <html lang="en">
                <Provider>
                    <body
                        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                    >
                        {children}
                    </body>
                </Provider>
            </html>
        </ClerkProvider>
    );
}
