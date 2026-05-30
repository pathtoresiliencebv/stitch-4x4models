import { redirect } from "next/navigation";

export default function CheckoutRedirect() {
  redirect("/en/shop/checkout");
}
