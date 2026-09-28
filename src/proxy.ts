// เติม: ชื่อที่ Next 16 ใช้ปกป้องเส้นทาง แทน middleware เดิม 
export { auth as proxy } from "@/auth"; 
 
export const config = { 
  matcher: ["/products/:id/edit", "/products/:id/delete"], 
}; 