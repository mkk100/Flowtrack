import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from "./components/NavBar";
import { NavigationGuardProvider } from "next-navigation-guard";
export const metadata: Metadata = {
  title: "Flowtrack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <ColorSchemeScript />
        </head>
        <body className="h-screen overflow-hidden bg-slate-50">
          <MantineProvider>
            <NavigationGuardProvider>
              <NavBar />
              {children}
            </NavigationGuardProvider>
          </MantineProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
