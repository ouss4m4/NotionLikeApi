import { computed } from 'vue'

export function useAuth() {
  const token = localStorage.getItem('jwt')

  const isAuthenticated = computed(() => !!token)

  const logout = () => {
    localStorage.removeItem('jwt')
    // optional: redirect or reset state
  }

  return {
    isAuthenticated,
    logout,
  }
}
