"use server";

import { auth } from "@/auth";
import { deleteProduct, updateProduct } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function updateProductAction(
  id: string,
  formData: FormData
) {
  // ตรวจ session ก่อนแก้ข้อมูล
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!name || !description) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("ราคาไม่ถูกต้อง");
  }

  updateProduct(id, { name, description, price });

  // ทำให้หน้าแรกดึงข้อมูลใหม่
  revalidatePath("/");

  redirect("/");
}

export async function deleteProductAction(id: string) {
  await requireUser();

  deleteProduct(id);

  revalidatePath("/");

  redirect("/");
}

