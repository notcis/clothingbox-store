export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/auth"], // เส้นทางที่ต้องการป้องกัน
};
