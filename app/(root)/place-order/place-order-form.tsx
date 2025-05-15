"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.action";
import { CheckIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";

export default function PlaceOrderForm() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await createOrder();

    console.log({ res });

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" disabled={pending}>
        {pending ? (
          <LoaderIcon className="w-4 h-4 animate-spin" />
        ) : (
          <CheckIcon className=" w-4 h-4" />
        )}{" "}
        Place Order
      </Button>
    );
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
}
