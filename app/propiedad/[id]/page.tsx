import { redirect } from "next/navigation";

export const revalidate = 3600;

export default function LegacyPropertyPage({ params }: { params: { id: string } }){
  redirect(`/property/${params.id}`);
}
