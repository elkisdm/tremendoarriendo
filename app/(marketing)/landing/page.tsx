import { redirect } from "next/navigation";

export const dynamic = "force-static";
export const revalidate = 0;

export default function LandingPage() {
  redirect("/coming-soon");
}


