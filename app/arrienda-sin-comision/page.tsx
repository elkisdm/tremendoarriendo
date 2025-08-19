import { redirect } from "next/navigation";
import { COMING_SOON } from '@lib/flags';
import { Header } from "@/components/marketing/Header";
import ArriendaSinComisionHero from "@/components/marketing/ArriendaSinComisionHero";
import ArriendaSinComisionGrid from "@/components/marketing/ArriendaSinComisionGrid";
import ArriendaSinComisionStats from "@/components/marketing/ArriendaSinComisionStats";
import HowItWorks from "@/components/marketing/HowItWorks";
import Trust from "@/components/marketing/Trust";
import StickyMobileCTA from "@/components/marketing/StickyMobileCTA";

export const revalidate = 3600;

export default function ArriendaSinComisionPage() {
  if (COMING_SOON) redirect('/coming-soon');
  
  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <ArriendaSinComisionHero />
        <ArriendaSinComisionStats />
        <ArriendaSinComisionGrid />
        <HowItWorks />
        <Trust />
      </main>
      <StickyMobileCTA />
    </>
  );
}

