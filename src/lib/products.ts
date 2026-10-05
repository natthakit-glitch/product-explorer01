// ชนิดข้อมูล, schema (zod) และค่าคงที่ของสินค้า
// ไฟล์นี้ไม่มีโค้ดฝั่ง server ทั้ง client และ server import ได้
import { z } from "zod";

// รายชื่อหมวดหมู่ https://dummyjson.com/products/category-list
export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;

export const SORT_FIELDS = ["title", "price", "stock"] as const;

// สินค้า 1 ชิ้น
export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z
    .number({ error: "กรุณากรอกราคา" })
    .min(0, "ราคาต้องไม่ติดลบ"),
  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, { error: "กรุณาเลือกหมวดหมู่" }),
  thumbnail: z.string(),
});

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

// ข้อมูลที่ผู้ใช้กรอกในฟอร์ม (ไม่มี id และ thumbnail)
export const ProductDraftSchema = ProductSchema.omit({
  id: true,
  thumbnail: true,
});

// เงื่อนไขค้นหา
export const SearchQuerySchema = z.object({
  q: z.string().trim(),
  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),
  sortBy: z.enum(SORT_FIELDS),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
export type ProductDraft = z.infer<typeof ProductDraftSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};

// ผลลัพธ์ที่ Server Action ส่งกลับ (ส่ง error เป็นข้อมูล เพราะข้อความ error
// ที่ throw จาก server จะถูกซ่อนเมื่อรันแบบ production)
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// แปลงข้อความจากฟอร์มเป็นตัวเลข (ช่องว่างให้เป็น NaN เพื่อให้ zod แจ้งว่ากรอกไม่ครบ)
function toNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text === "" ? NaN : Number(text);
}

// อ่านค่าจาก FormData (หน้าแก้ไข) แล้วตรวจด้วย ProductDraftSchema
export function parseDraftFormData(formData: FormData) {
  return ProductDraftSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    price: toNumber(formData.get("price")),
    stock: toNumber(formData.get("stock")),
    category: String(formData.get("category") ?? ""),
  });
}