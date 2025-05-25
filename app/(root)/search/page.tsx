import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import Link from "next/link";

const prices = [
  {
    name: "฿1 - ฿500",
    value: "1-500",
  },
  {
    name: "฿501 - ฿1,000",
    value: "501-1000",
  },
  {
    name: "฿1,001 - ฿2,000",
    value: "1001-2000",
  },
  {
    name: "฿2,001 - ฿5,000",
    value: "2001-5000",
  },
  {
    name: "฿5,001 - ฿10,000",
    value: "5001-10000",
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ["newest", "lowest", "highest", "rating"];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    category: string;
    q: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `search ${isQuerySet ? q : ""} ${
        isCategorySet ? `: Category ${category}` : ""
      } ${isPriceSet ? `: Price ${price}` : ""} ${
        isRatingSet ? `: Rating ${rating}` : ""
      }  `,
    };
  } else {
    return {
      title: "search Products",
    };
  }
}

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await searchParams;

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className=" grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <div className=" text-xl mb-2 mt-3">Collection</div>
        <div>
          <ul className=" space-y-1">
            <li>
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                ทั้งหมด
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${category === x.category && "font-bold"}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className=" text-xl mb-2 mt-8">ช่วงราคา</div>
        <div>
          <ul className=" space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                ทั้งหมด
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && "font-bold"}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className=" text-xl mb-2 mt-8">คะแนน</div>
        <div>
          <ul className=" space-y-1">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                ทั้งหมด
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && "font-bold"}`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {`${r} ดาวขึ้นไป`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4 md:col-span-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "ค้นหา : " + q}
            {category !== "all" &&
              category !== "" &&
              " Collection : " + category}
            {price !== "all" && " ช่วงราคา : " + price + " บาท"}
            {rating !== "all" && " คะแนน : " + rating + " ดาวขึ้นไป"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant="link" asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{" "}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort == s && "font-bold"}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}{" "}
          </div>
        </div>
        <div className=" grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>ไม่พบสินค้าที่คุณเลือก</div>}
          {products.data.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, stock: Number(product.stock) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
