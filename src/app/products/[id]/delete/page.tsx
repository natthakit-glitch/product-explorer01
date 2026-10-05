// หน้ายืนยันการลบสินค้า (/products/[id]/delete)
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/product-store";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  // ไม่ล็อกอินให้กลับหน้าแรก
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  const product = await getProduct(Number(id));

  if (!product) {
    notFound();
  }

  // ผูก id ให้ action ลบ
  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main>
      <h1>ยืนยันการลบ</h1>

      <p>ต้องการลบสินค้า “{product.title}” หรือไม่?</p>

      <div>
        {/* ปุ่มนี้ส่งฟอร์มแบบ POST เพื่อลบสินค้าจริง */}
        <form action={deleteAction}>
          <button type="submit">ยืนยันการลบ</button>
        </form>

        <Link href="/">ยกเลิก</Link>
      </div>
    </main>
  );
}