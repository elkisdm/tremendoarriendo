import { redirect } from 'next/navigation';
import { COMING_SOON } from '../lib/flags';

export const revalidate = 0; // Sin cache para forzar revalidación

export default function Home() {
  console.log('COMING_SOON flag:', COMING_SOON);
  
  if (COMING_SOON) {
    console.log('Redirecting to /coming-soon');
    redirect('/coming-soon');
  }
  
  console.log('Redirecting to /landing');
  redirect('/landing');
}
