import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import { useUserStore } from '@/stores/user'
import MainLayout from '@/views/MainLayout.vue'
import DocumentView from '@/views/DocumentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignupView,
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
        {
          path: 'documents/:id',
          name: 'Document',
          component: DocumentView,
        },
        // add more layout-wrapped routes here if needed
      ],
    },
  ],
})

router.beforeEach((to, _) => {
  const { isAuthenticated } = useUserStore()

  if (!isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' }
  }
})

export default router
