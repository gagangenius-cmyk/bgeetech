import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payment-success";

export const metadata: Metadata = { title: "Care plan received", robots: { index: false } };

export default function CareSuccess() {
  return (
    <div>
      <div aria-hidden className="h-16 bg-ink" />
      <PaymentSuccess title="Welcome aboard!" nextHref="/portal" nextLabel="Go to client portal">
        <p>
          We are confirming your payment now. Within a few minutes your plan shows as active in the client portal, where you can ask for fixes and changes. Sign in with the email you used at checkout.
        </p>
      </PaymentSuccess>
    </div>
  );
}
