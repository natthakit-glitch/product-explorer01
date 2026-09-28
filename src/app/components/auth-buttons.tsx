import { signIn, signOut } from "@/auth"; 
 
type AuthButtonsProps = { 
  isLoggedIn: boolean; 
  userName?: string | null; 
}; 
 
export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) { 
  if (isLoggedIn) { 
    return ( 
      <div> 
        <span>สวัสดี {userName ?? "ผู้ใช้งาน"}</span> 
        <form 
          action={async () => { 
            "use server"; 
            await signOut({ redirectTo: "/" }); 
          }} 
        > 
          <button type="submit">Logout</button> 
        </form> 
      </div> 
    ); 
  } 
 
  return ( 
    <form 
      action={async () => { 
        "use server"; 
        // เติม: ชื่อ provider ของ Google (ตัวพิมพ์เล็ก) 
        await signIn("google", { redirectTo: "/" }); 
      }} 
    > 
      <button type="submit">Login with Google</button> 
    </form> 
  ); 
} 