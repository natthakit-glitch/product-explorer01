import NextAuth from "next-auth";
import Google from "next-auth/providers/google";


export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  // ใช้ Google เป็นผู้ยืนยันตัวตน 
  providers: [Google],

  callbacks: {
    // proxy เรียกฟังก์ชันนี้เพื่อตัดสินว่าให้เข้าหน้านั้นได้หรือไม่ 
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      // ตรวจว่า URL เป็นหน้าแก้ไขหรือลบสินค้า 
      const isProductManagementPage =
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);

      // หน้าแก้ไข/ลบ ต้องมีผู้ใช้ที่ล็อกอินแล้วเท่านั้น
      if (isProductManagementPage) {
        return Boolean(auth?.user);
      }

      // หน้าอื่นเข้าได้ทุกคน
      return true;
    },
  },
});