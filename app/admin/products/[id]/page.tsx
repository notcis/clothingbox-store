import { requireAdmin } from "@/auth-guard";
import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Update Product",
};

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className=" space-y-8 max-w-5xl mx-auto">
      <h1 className=" h2-bold">Update Product</h1>
      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
}
