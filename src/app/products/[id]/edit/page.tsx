// หน้าแก้ไขสินค้า (/products/[id]/edit)
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/product-store";
import { CATEGORIES } from "@/lib/products";
import { updateProductAction } from "@/app/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // ไม่ล็อกอินให้กลับหน้าแรก
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Next 16: params เป็น Promise ต้อง await
  const { id } = await params;

  // id ใน URL เป็นข้อความ แต่ id ของสินค้าเป็นตัวเลข จึงแปลงด้วย Number
  const product = await getProduct(Number(id));

  if (!product) {
    notFound();
  }

  // ผูก id เป็น argument ตัวแรกของ action ไว้ก่อน ฟอร์มจะส่งมาแค่ formData
  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <main>
      <h1>แก้ไขสินค้า</h1>

      <form action={updateAction}>
        <div>
          <label htmlFor="title">ชื่อสินค้า</label>
          <input
            id="title"
            name="title"
            defaultValue={product.title}
            required
          />
        </div>

        <div>
          <label htmlFor="price">ราคา</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price}
            required
          />
        </div>

        <div>
          <label htmlFor="stock">จำนวนคงเหลือ</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            defaultValue={product.stock}
            required
          />
        </div>

        <div>
          <label htmlFor="category">หมวดหมู่</label>
          <select
            id="category"
            name="category"
            defaultValue={product.category}
            required
          >
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit">บันทึก</button>
          <Link href="/">ยกเลิก</Link>
        </div>
      </form>
    </main>
  );
}