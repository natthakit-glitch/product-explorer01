// Server Action: ฟังก์ชันที่รันบน server
"use server";

import { auth } from "@/auth";
import {
  createProduct,
  deleteProduct,
  searchProducts,
  updateProduct,
} from "@/lib/product-store";
import {
  ProductDraftSchema,
  SearchQuerySchema,
  parseDraftFormData,
} from "@/lib/products";
import type {
  ActionResult,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ตรวจว่าล็อกอินอยู่ ถ้าไม่ล็อกอินให้หยุดด้วย error
async function requireUser() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

// ค้นหาสินค้า (อ่านอย่างเดียว ไม่ต้องล็อกอิน)
export async function searchProductsAction(
  query: SearchQuery
): Promise<ActionResult<ProductList>> {
  const parsed = SearchQuerySchema.safeParse(query);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  try {
    return { ok: true, data: await searchProducts(parsed.data) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ",
    };
  }
}

// เพิ่มสินค้า (เรียกจากฟอร์มบนหน้าแรก)
export async function createProductAction(
  draft: ProductDraft
): Promise<ActionResult> {
  await requireUser();

  // ตรวจข้อมูลที่ server อีกครั้ง
  const parsed = ProductDraftSchema.safeParse(draft);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  await createProduct(parsed.data);

  revalidatePath("/");

  return { ok: true, data: undefined };
}

// แก้ไขสินค้า (id ผูกมาจากหน้าแก้ไขด้วย .bind)
export async function updateProductAction(id: number, formData: FormData) {
  await requireUser();

  const parsed = parseDraftFormData(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  await updateProduct(id, parsed.data);

  revalidatePath("/");

  redirect("/");
}

// ลบสินค้า
export async function deleteProductAction(id: number) {
  await requireUser();

  await deleteProduct(id);

  revalidatePath("/");

  redirect("/");
}