<script setup lang="ts">

import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const props = defineProps<{
  class?: HTMLAttributes['class'],
  signup?: boolean
}>()

const signup = props.signup ?? false;

const email = ref("");
const password = ref("");
const passwordconfirm = ref("")
const name = ref("")

const isLoading = ref(false);
const errorMsg = ref("");


const handleSubmit = async () => {
  return signup ? handleSignup() : handleLogin();

}

const handleSignup = async () => {

  if (password.value != passwordconfirm.value) {
    errorMsg.value = 'Passwords not matching';
    return;
  }

  try {
    isLoading.value = true;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMsg.value = data.message ?? data.error ?? "signup failed";
      isLoading.value = false;

      return
    }

    // / redirect, etc.
    router.push("/login")
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false;
}
const handleLogin = async () => {
  isLoading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMsg.value = data.message ?? data.error ?? "login failed";
      isLoading.value = false;

      return
    }

    // localStorage.setItem('jwt', data.token)userStore.setToken(data.token)
    userStore.setToken(data.token)
    userStore.setProfile(data.user.name ?? '', data.user.email ?? '')
    router.push("/")
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false;
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="min-w-lg">
      <CardHeader>
        <CardTitle>{{ signup ? "Create Your Account" : "Login to your account" }} </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-6">
            <div v-if="signup" class="grid gap-3">
              <Label for="name">Name</Label>
              <Input v-model="name" id="name" type="name" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input v-model="email" id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <a v-if="!signup" href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Input v-model="password" id="password" type="password" required />
            </div>
            <div v-if="signup" class="grid gap-3">
              <div class="flex items-center">
                <Label for="passwordconfirm">Confirm Password</Label>
              </div>
              <Input v-model="passwordconfirm" id="passwordconfirm" type="password" required />
            </div>
            <div class="flex flex-col gap-3">
              <Button type="submit" class="w-full cursor-pointer" :disabled="isLoading">
                {{ signup ? "Register" : "Login" }}
              </Button>
              <p class="mx-auto text-red-400" v-if="errorMsg.length">{{ errorMsg }}</p>
            </div>
          </div>
          <div v-if="signup" class="mt-4 text-center text-sm">
            Already have an account?
            <RouterLink to="/login" class="underline underline-offset-4">
              Login
            </RouterLink>
          </div>
          <div v-else class="mt-4 text-center text-sm">
            Don't have an account?
            <RouterLink to="/signup" class="underline underline-offset-4">
              Sign up
            </RouterLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
