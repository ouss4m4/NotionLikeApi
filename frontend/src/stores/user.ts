import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('jwt') || '')
  const email = ref(localStorage.getItem('email') || '')
  const name = ref(localStorage.getItem('name') || '')

  const isAuthenticated = computed(() => !!token.value)
  const profile = computed(() => ({ email: email.value, name: name.value }))

  function setProfile(newName: string, newEmail: string) {
    name.value = newName
    localStorage.setItem('name', name.value)
    email.value = newEmail
    localStorage.setItem('email', email.value)
  }

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('jwt', newToken)
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('jwt')
    name.value = ''
    email.value = ''
  }

  return {
    token,
    email,
    name,
    isAuthenticated,
    profile,
    setProfile,
    setToken,
    logout,
  }
})
