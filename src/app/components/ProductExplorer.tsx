"use client";

import { useState } from "react";
import Link from "next/link";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";

import { createProductAction, searchProductsAction } from "@/app/actions";
import { defaultQuery } from "@/lib/products";

import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/products";

type LoadState = "loading" | "error" | "ready";

type ProductExplorerProps = {
  initialList: ProductList | null;
  initialError: string;
  isLoggedIn: boolean; // ใช้ซ่อน/แสดงฟอร์มเพิ่มและปุ่มแก้ไข/ลบ
};

export default function ProductExplorer({
  initialList,
  initialError,
  isLoggedIn,
}: ProductExplorerProps) {
  const [products, setProducts] = useState<Product[]>(
    initialList?.products ?? []
  );
  const [status, setStatus] = useState<LoadState>(
    initialError ? "error" : "ready"
  );
  const [errorMessage, setErrorMessage] = useState(initialError);
  const [formError, setFormError] = useState("");
  const [query, setQuery] = useState<SearchQuery>(defaultQuery);

  // ค้นหาโดยเรียก Server Action
  async function loadProducts(nextQuery: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    const result = await searchProductsAction(nextQuery);

    if (result.ok) {
      setProducts(result.data.products);
      setQuery(nextQuery);
      setStatus("ready");
    } else {
      setErrorMessage(result.error);
      setStatus("error");
    }
  }

  // เพิ่มสินค้าใหม่ แล้วค้นหาใหม่ด้วยเงื่อนไขเดิมเพื่อให้ตารางอัปเดต
  async function addProduct(draft: ProductDraft) {
    setFormError("");

    try {
      const result = await createProductAction(draft);

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      await loadProducts(query);
    } catch {
      setFormError("บันทึกไม่สำเร็จ");
    }
  }

  return (
    <div>
      <ProductSearchForm onSearch={loadProducts} />

      {/* ฟอร์มเพิ่มสินค้า แสดงเฉพาะตอนล็อกอิน */}
      {isLoggedIn && (
        <section>
          <ProductForm editing={null} onSave={addProduct} onCancel={() => {}} />
          {formError && <p role="alert">{formError}</p>}
        </section>
      )}

      <section aria-live="polite">
        {status === "loading" && <p>กำลังโหลดข้อมูล...</p>}

        {status === "error" && <p role="alert">{errorMessage}</p>}

        {status === "ready" && products.length === 0 && (
          <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}

        {status === "ready" && products.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>คงเหลือ</th>
                <th>หมวดหมู่</th>
                {isLoggedIn && <th>จัดการ</th>}
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr key={item.id} data-testid="product">
                  <td>
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        width={80}
                        height={80}
                      />
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.category}</td>
                  {isLoggedIn && (
                    <td>
                      {/* ไปหน้าแก้ไข/ลบ (ถูกป้องกันด้วย proxy และตรวจ session ซ้ำ) */}
                      <Link href={`/products/${item.id}/edit`}>แก้ไข</Link>
                      <Link href={`/products/${item.id}/delete`}>ลบ</Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}