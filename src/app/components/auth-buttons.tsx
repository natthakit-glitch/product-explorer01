// ปุ่ม Login (ยังไม่ล็อกอิน) หรือ Logout (ล็อกอินแล้ว)
import { signIn, signOut } from "@/auth";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  // ล็อกอินแล้ว: แสดงชื่อและปุ่ม Logout
  if (isLoggedIn) {
    return (
      <div>
        <span>สวัสดี {userName ?? "ผู้ใช้งาน"}</span>
        <form
          action={async () => {
            "use server"; // ให้ฟังก์ชันนี้รันบน server
            await signOut({ redirectTo: "/" }); // ออกจากระบบแล้วกลับหน้าแรก
          }}
        >
          <button type="submit">Logout</button>
        </form>
      </div>
    );
  }

  // ยังไม่ล็อกอิน: ปุ่ม Login
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" }); // ไปหน้า login ของ Google
      }}
    >
      <button type="submit">Login with Google</button>
    </form>
  );
}