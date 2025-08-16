import HeroV2 from "@/components/marketing/HeroV2";
import FeaturedGrid from "@/components/marketing/FeaturedGrid";
import HowItWorks from "@/components/marketing/HowItWorks";
import Trust from "@/components/marketing/Trust";
import StickyMobileCTA from "@/components/marketing/StickyMobileCTA";

export const dynamic = "force-static";
export const revalidate = 0;

export default async function LandingV2Page() {
  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <HeroV2 />
        <FeaturedGrid />
        <HowItWorks />
        <Trust />
      </main>
      <StickyMobileCTA />
    </>
  );
}


