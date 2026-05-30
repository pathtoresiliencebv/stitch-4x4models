import { redirect } from "next/navigation";

export default function OrderConfirmedRedirect() {
  redirect("/en/shop/order-confirmed");
}
