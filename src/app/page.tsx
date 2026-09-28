import Link from "next/link"; 
import { auth } from "@/auth"; 
import { getProducts } from "@/lib/products"; 
import { AuthButtons } from "@/app/components/auth-buttons"; 
 
export default async function HomePage() { 
  const session = await auth(); 
  const products = getProducts(); 
  // เติม: ฟังก์ชันที่แปลงค่าเป็น true หรือ false 
  const isLoggedIn = !!session?.user; 
 
  return ( 
    <main> 
      <header> 
        <h1>สินค้า</h1> 
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} /> 
      </header> 
 
      <div> 
        {products.map((product) => ( 
          <article key={product.id} data-testid="product"> 
            <h2>{product.name}</h2> 
            <p>{product.description}</p> 
            <p>฿{product.price.toLocaleString("th-TH")}</p> 
            {isLoggedIn && ( 
              <div> 
                <Link href={`/products/${product.id}/edit`}>แก้ไข</Link> 
                <Link href={`/products/${product.id}/delete`}>ลบ</Link> 
              </div> 
            )} 
          </article> 
        ))} 
        {products.length === 0 && <p>ไม่มีสินค้า</p>} 
      </div> 
    </main> 
  ); 
} 