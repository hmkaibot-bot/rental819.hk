import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export default function WhatsAppFloat({ label }: { label: string }) {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:brightness-95 lg:h-16 lg:w-16"
    >
      <WhatsAppIcon className="h-7 w-7 lg:h-8 lg:w-8" />
    </a>
  );
}
