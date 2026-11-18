import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payment-success";

export const metadata: Metadata = { title: "Order received", robots: { index: false } };

export default function BuilderSuccess() {
  return (
    <div>
      <div aria-hidden className="h-16 bg-ink" />
      <PaymentSuccess title="Thank you, your order is in!" nextHref="/" nextLabel="Back to home">
        <p>
          We are confirming your payment now and will email you shortly to begin designing your website. Keep your reference handy if you
          need to contact us.
        </p>
      </PaymentSuccess>
    </div>
  );
}
