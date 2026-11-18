import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payment-success";

export const metadata: Metadata = { title: "Booking received", robots: { index: false } };

export default function BookingSuccess() {
  return (
    <div>
      <div aria-hidden className="h-16 bg-ink" />
      <PaymentSuccess title="Thank you, your booking is in!" nextHref="/" nextLabel="Back to home">
        <p>
          We are confirming your payment now. A confirmation email with your video link will arrive shortly. If you do not see it within a few
          minutes, check your spam folder or message us on WhatsApp.
        </p>
      </PaymentSuccess>
    </div>
  );
}
