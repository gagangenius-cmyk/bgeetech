import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { getNextFreeSlot } from "@/lib/db/queries";

/** "Next free call: Tue 18 Nov, 10:30" so booking feels immediate. Renders nothing when no slot is free. */
export async function NextSlot() {
  const slot = await getNextFreeSlot();
  if (!slot) return null;
  const label = new Date(`${slot.date}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  return (
    <Link href="/book" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-medium text-white transition hover:bg-white/15">
      <CalendarCheck className="size-4 text-accent" aria-hidden />
      Next free call: {label} at {slot.time}
    </Link>
  );
}
