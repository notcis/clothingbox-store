"use server";
import {
  ConvertJsonDbToStringArray,
  convertToPlainObject,
  formatError,
} from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";
import { Prisma } from "@/prisma/app/generated/prisma/client";

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
    numReviews: product.numReviews.toString(),
    images: ConvertJsonDbToStringArray(product.images),
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
    images: ConvertJsonDbToStringArray(data.images),
    price: data.price.toString(), // หรือ +product.price เพื่อให้เป็น number
    rating: data.rating.toString(), // ถ้า rating ก็เป็น Decimal
    numReviews: data.numReviews.toString(),
  };
}

export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  if (!data) {
    return null;
  }

  const newData = {
    ...data,
    images: ConvertJsonDbToStringArray(data.images),
    price: data.price.toString(), // หรือ +product.price เพื่อให้เป็น number
    rating: data.rating.toString(), // ถ้า rating ก็เป็น Decimal
    numReviews: data.numReviews.toString(),
  };

  return convertToPlainObject(newData);
}

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
          },
        }
      : {};
  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const sanitizedProducts = data.map((product) => ({
    ...product,
    price: product.price.toString(), // หรือ +product.price เพื่อให้เป็น number
    rating: product.rating.toString(), // ถ้า rating ก็เป็น Decimal
    stock: product.stock.toString(),
    numReviews: product.numReviews.toString(),
    images: ConvertJsonDbToStringArray(product.images),
  }));

  const dataCount = await prisma.product.count();

  return {
    data: sanitizedProducts,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: {
        ...product,
        images: JSON.stringify(product.images),
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const productExists = await prisma.product.findFirst({
      where: {
        id: product.id,
      },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        ...product,
        images: JSON.stringify(product.images),
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

export async function getFeaturedProduct() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });
  const sanitizedProducts = data.map((product) => ({
    ...product,
    price: product.price.toString(), // หรือ +product.price เพื่อให้เป็น number
    rating: product.rating.toString(), // ถ้า rating ก็เป็น Decimal
    numReviews: product.numReviews.toString(),
    images: ConvertJsonDbToStringArray(product.images),
  }));

  return convertToPlainObject(sanitizedProducts);
}
