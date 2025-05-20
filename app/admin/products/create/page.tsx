import { requireAdmin } from "@/auth-guard";
import ProductForm from "@/components/admin/product-form";

export const metadata = {
  title: "Create Product",
};

export default async function page() {
  await requireAdmin();
  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  );
}
