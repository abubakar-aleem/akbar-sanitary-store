import { STORE } from '@/lib/data';
import { Whatsapp } from './Icons';

export default function WhatsAppFloat() {
  return (
    <a className="wa-float" href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent('Hello Akbar & Sons! I have a question about your products.')}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      <Whatsapp />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
