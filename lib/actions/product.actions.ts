"use server";
import { ConvertJsonDbToString, convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  const sanitizedProducts = data.map((product) => ({
    ...product,
    price: product.price.toString(), // หรือ +product.price เพื่อให้เป็น number
    rating: product.rating.toString(), // ถ้า rating ก็เป็น Decimal
    images: ConvertJsonDbToString(product.images),
  }));

  return convertToPlainObject(sanitizedProducts);
}

export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findFirst({
    where: { slug: slug },
  });

  if (!data) {
    return null;
  }

  return {
    ...data,
    images: ConvertJsonDbToString(data.images),
  };
}
