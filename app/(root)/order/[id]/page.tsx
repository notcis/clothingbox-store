import { getOrderById } from "@/lib/actions/order.action";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";

export const metadata = {
  title: "Order Details",
};

export default async function page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) notFound();

  console.log(order.orderitem);

  return (
    <OrderDetailsTable
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
    />
  );
}
