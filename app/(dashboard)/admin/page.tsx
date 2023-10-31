import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const page = async() => {
    const session = await getServerSession(authOptions)
    if (session?.user){
        return (
            <div className="text-2xl">Welcome to admin {session?.user.username}</div>
          )
    }
    return (
        <h2 className="text-2xl">Please Login</h2>
    )
  
}

export default page