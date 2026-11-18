"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/widgets/chat-widget";
import { WhatsAppButton } from "@/components/widgets/whatsapp-button";

// Step-by-step flows keep their Back/Continue bar in the thumb zone on phones, so the floating
// launchers step aside there (BGee and WhatsApp stay available from the More menu).
const FLOWS = ["/builder", "/book", "/estimate"];

export function FloatingWidgets() {
  const pathname = usePathname();
  const hideOnMobile = FLOWS.some((p) => pathname.startsWith(p));
  return (
    <>
      <WhatsAppButton hideOnMobile={hideOnMobile} />
      <ChatWidget />
    </>
  );
}
