import { ref, onMounted } from 'vue'
import { supabase } from './useSupabase'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    loading.value = false
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (!error) user.value = data.user
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) user.value = data.user
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) user.value = null
    return { error }
  }

  onMounted(() => {
    checkUser()

    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
    })
  })

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    checkUser
  }
}
