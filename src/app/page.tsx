// หน้าแรก: โหลดสินค้าจาก server แล้วส่งให้ ProductExplorer (client)
import { auth } from "@/auth";
import { searchProducts } from "@/lib/product-store";
import { defaultQuery } from "@/lib/products";
import type { ProductList } from "@/lib/products";
import { AuthButtons } from "@/app/components/auth-buttons";
import ProductExplorer from "@/app/components/ProductExplorer";
export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // โหลดรายการเริ่มต้น ถ้าไม่สำเร็จให้ส่งข้อความ error ไปแสดง
  let initialList: ProductList | null = null;
  let initialError = "";

  try {
    initialList = await searchProducts(defaultQuery);
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ";
  }

  return (
    <main>
      <header>
        <h1>สินค้า</h1>
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </header>

      <ProductExplorer
        initialList={initialList}
        initialError={initialError}
        isLoggedIn={isLoggedIn}
      />
    </main>
  );
}