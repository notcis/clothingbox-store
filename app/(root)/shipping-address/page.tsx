import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata = {
  title: "Shipping Address",
};

export default async function page() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error("No user Id");

  const user = await getUserById(userId);
  const address =
    typeof user.address === "string" ? JSON.parse(user.address) : null;

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={address as ShippingAddress} />
    </>
  );
}
