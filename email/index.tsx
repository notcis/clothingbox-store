import { APP_NAME, SENDER_EMAIL } from "@/lib/constants";
import { Resend } from "resend";
import PurchaseReceipt from "./purchase-receipt";

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendPurchaseReceipt = async ({ order }: { order: any }) => {
  console.log(order.user.email);

  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceipt order={order} />,
  });
};
