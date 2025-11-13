"use client";
import React from "react";
import Providers from "./Providers";
import { NotificationProvider } from "./Notification";
import Header from "./Header";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <NotificationProvider>
        <Header />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </NotificationProvider>
    </Providers>
  );
  
}
