"use client";

import { useState, useEffect } from "react";
import { COMING_SOON } from '@lib/flags';
import { Header } from "@/components/marketing/Header";
import ArriendaSinComisionHero from "@/components/marketing/ArriendaSinComisionHero";
import ArriendaSinComisionGrid from "@/components/marketing/ArriendaSinComisionGrid";
import Benefits from "@/components/marketing/Benefits";
import HowItWorks from "@/components/marketing/HowItWorks";
import Trust from "@/components/marketing/Trust";
import StickyMobileCTA from "@/components/marketing/StickyMobileCTA";
import ContactModal from "@/components/marketing/ContactModal";

export default function ArriendaSinComisionPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Renderizar contenido básico mientras se hidrata
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Verificar flag de coming soon
  if (COMING_SOON) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Próximamente</h1>
          <p className="text-lg text-muted-foreground">Estamos preparando algo increíble</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <ArriendaSinComisionHero onContactClick={() => setIsContactModalOpen(true)} />
        <Benefits />
        <ArriendaSinComisionGrid />
        <HowItWorks />
        <Trust />
      </main>
      <StickyMobileCTA onContactClick={() => setIsContactModalOpen(true)} />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}

