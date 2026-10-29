import type { Metadata } from 'next';
import { Kiosk } from '@/components/Kiosk';
import './kiosk.css';

export const metadata: Metadata = { title: 'T4CTILE — Borne', robots: { index: false, follow: false } };

export default function KioskPage() {
  return <Kiosk />;
}
