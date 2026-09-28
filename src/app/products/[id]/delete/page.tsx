import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();

  if (!session?.user) {
    // ถ้ายังไม่ได้ล็อกอิน ให้กลับหน้าแรก
    redirect("/");
  }

  const { id } = await params;

  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main>
      <h1>ยืนยันการลบ</h1>

      <p>ต้องการลบสินค้า “{product.name}” หรือไม่?</p>

      <div>
        <form action={deleteAction}>
          <button type="submit">ยืนยันการลบ</button>
        </form>

        <Link href="/">ยกเลิก</Link>
      </div>
    </main>
  );
}

