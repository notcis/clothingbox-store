import { requireAdmin } from "@/auth-guard";

export default async function page() {
  await requireAdmin();
  return <div>page</div>;
}
