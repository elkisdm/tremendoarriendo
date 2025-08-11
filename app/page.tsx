import { redirect } from 'next/navigation';
import { COMING_SOON } from '../lib/flags';

export const revalidate = 3600;

export default function Home() {
  if (COMING_SOON) redirect('/coming-soon');
  // Ajusta si tu home real es otra ruta
  redirect('/landing');
}
