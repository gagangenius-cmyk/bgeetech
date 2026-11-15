import { whatsappUrl } from "@/lib/chat-knowledge";

/** Floating WhatsApp button (official brand green). Opens a chat with the business number. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/30 transition-transform duration-300 hover:scale-110 active:scale-95"
    >
      <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full" style={{ color: "#25D366" }} />
      <svg viewBox="0 0 32 32" className="relative size-8" aria-hidden fill="currentColor">
        <path d="M16.04 3C9.4 3 4 8.38 4 15.01c0 2.12.55 4.19 1.6 6.02L4 28l7.15-1.87a12.05 12.05 0 0 0 4.89 1.03h.01C22.68 27.16 28 21.78 28 15.15 28 11.95 26.75 8.94 24.5 6.69A11.9 11.9 0 0 0 16.04 3Zm0 21.99h-.01a10 10 0 0 1-5.1-1.4l-.37-.22-3.8.99 1.02-3.7-.24-.38a9.95 9.95 0 0 1-1.53-5.28c0-5.5 4.5-9.97 10.04-9.97 2.68 0 5.2 1.04 7.09 2.93a9.9 9.9 0 0 1 2.93 7.05c0 5.5-4.5 9.98-10.03 9.98Zm5.5-7.47c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
      </svg>
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
