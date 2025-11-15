"use client";
import React from "react";
import Providers from "./Providers";
import { NotificationProvider } from "./Notification";
import Header from "./Header";
import { ImageKitProvider } from "imagekitio-next";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <NotificationProvider>
        <ImageKitProvider 
          publicKey={process.env.NEXT_PUBLIC_PUBLIC_KEY!}
          urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT!}
        >
          <Header />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </ImageKitProvider>
      </NotificationProvider>
    </Providers>
  );
  
}
