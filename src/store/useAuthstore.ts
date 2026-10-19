import { supabase } from "@/lib/supabase/client";
import { create } from "zustand";


interface AuthStore {
   user : string | null
   isLoading : boolean
   
   fetchUser: () => Promise<void>
   signOut: ()=> Promise<void>
}


export const useAuthStore = create<AuthStore>((set)=>({
    user : null ,
    isLoading : true,
    fetchUser: async()=>{
        try {
            set({isLoading:true})
            const {data ,error} = await supabase.auth.getUser()

            set({ user: error ? null : (data.user?.email ?? null) });  
            
        } catch (error) {
            console.error('Error fetching user:', error)
        } finally {
            set({ isLoading: false })
        }
    } ,
     signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null,  })
    }
}))