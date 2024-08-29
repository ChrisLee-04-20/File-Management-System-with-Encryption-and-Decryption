// Composables
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Login.vue'
import UserView from '@/views/User.vue'
import RegisterView from '@/views/Register.vue'
import EncyptWithPassphaseView from '@/views/EncyptWithPassphrase.vue'
import DecyptWithPassphaseView from '@/views/DecyptWithPassphrase.vue'
import PublicKeyGenerationView from '@/views/PublicKeyGeneration.vue' 
import EncyptWithPublicKeyView from '@/views/EncyptWithPublicKey.vue'
import DecyptWithPrivateKeyView from '@/views/DecryptWithPrivateKey.vue'
import DisplayAllFilesView from '@/views/DisplayAllFiles.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the rsoute is visited.
        component: () => LoginView,
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginView
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterView
      },
      {
        path: 'user',
        name: 'User',
        component: UserView
      },
      {
        path: 'encypt_with_passphrase',
        name: 'EncyptWithPassphrase',
        component: EncyptWithPassphaseView
      },
      {
        path: 'decypt_with_passphrase',
        name: 'DecyptWithPassphrase',
        component: DecyptWithPassphaseView
      },
      {
        path: 'public_key_generation',
        name: 'PublicKeyGeneration',
        component: PublicKeyGenerationView
      },
      {
        path: 'encypt_with_public_key',
        name: 'EncyptWithPublicKey',
        component: EncyptWithPublicKeyView
      },
      {
        path: 'decypt_with_private_key',
        name: 'DecyptWithPrivateKey',
        component: DecyptWithPrivateKeyView
      },
      {
        path: 'all_files',
        name: 'AllFiles',
        component: DisplayAllFilesView
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
