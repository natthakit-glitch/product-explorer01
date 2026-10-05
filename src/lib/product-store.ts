// ที่เก็บข้อมูลสินค้าฝั่ง server (เก็บใน memory)
// โหลดข้อมูลตั้งต้นจาก dummyjson ครั้งเดียว แล้วแก้ไข/ลบ/เพิ่มที่นี่
// ข้อมูลจะกลับเป็นของ API เมื่อ restart server
import { ProductSchema } from "@/lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/products";

const SEED_URL =
  "https://dummyjson.com/products?limit=0&select=title,price,stock,category,thumbnail";

declare global {
  var productStorePromise: Promise<Product[]> | undefined;
}

// ดึงสินค้าทั้งหมดจาก API แล้วเก็บเฉพาะรายการที่ตรงกับ ProductSchema
async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(SEED_URL);

  if (!response.ok) {
    throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
  }

  const data: { products?: unknown[] } = await response.json();

  if (!Array.isArray(data.products)) {
    throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
  }

  return data.products.flatMap((item) => {
    const parsed = ProductSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}

// โหลดครั้งแรกครั้งเดียว ถ้าโหลดไม่สำเร็จให้ล้างค่า ครั้งต่อไปจะลองใหม่
function getStore(): Promise<Product[]> {
  if (!globalThis.productStorePromise) {
    globalThis.productStorePromise = fetchAllProducts().catch((error) => {
      globalThis.productStorePromise = undefined;
      throw error;
    });
  }

  return globalThis.productStorePromise;
}

// ค้นหา เรียง และจำกัดจำนวน ตามเงื่อนไขในฟอร์มค้นหา
export async function searchProducts(query: SearchQuery): Promise<ProductList> {
  const all = await getStore();
  const keyword = query.q.toLowerCase();

  const matched = all.filter(
    (item) =>
      item.title.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
  );

  const sorted = [...matched].sort((a, b) =>
    query.sortBy === "title"
      ? a.title.localeCompare(b.title)
      : a[query.sortBy] - b[query.sortBy]
  );

  return {
    products: sorted.slice(0, query.limit),
    total: matched.length,
    skip: 0,
    limit: query.limit,
  };
}

export async function getProduct(id: number) {
  const all = await getStore();
  return all.find((item) => item.id === id);
}

export async function createProduct(draft: ProductDraft) {
  const all = await getStore();
  const id = all.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  all.push({ ...draft, id, thumbnail: "" });
}

export async function updateProduct(id: number, draft: ProductDraft) {
  const product = await getProduct(id);

  if (!product) {
    throw new Error("Product not found");
  }

  Object.assign(product, draft);
}

export async function deleteProduct(id: number) {
  const all = await getStore();
  const index = all.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Product not found");
  }

  all.splice(index, 1);
}