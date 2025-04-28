"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(`${item.name} added to cart`, {
      action: {
        label: "Go To Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  return (
    <Button onClick={handleAddToCart} className=" w-full" type="button">
      <PlusIcon /> Add To Cart
    </Button>
  );
}
