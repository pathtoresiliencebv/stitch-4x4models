"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    // Payment is now handled within the checkout flow
    // Redirect to checkout if someone navigates directly to /shop/payment
    router.replace("/shop/checkout");
  }, [router]);

  return null;
}
