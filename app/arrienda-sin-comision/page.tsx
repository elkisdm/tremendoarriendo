"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
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

  if (!isClient) {
    return null; // Evitar hidratación
  }

  if (COMING_SOON) redirect('/coming-soon');
  
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

