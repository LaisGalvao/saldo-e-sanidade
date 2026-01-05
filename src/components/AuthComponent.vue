<template>
  <div class="auth-container">
    <h1>Saldo & Sanidade</h1>
    <div class="auth-card">
      <h2>{{ isSignUp ? 'Criar Conta' : 'Entrar' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            required 
            placeholder="seu@email.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••"
          />
        </div>
        
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar') }}
        </button>
      </form>
      
      <p class="toggle-mode">
        {{ isSignUp ? 'Já tem conta?' : 'Não tem conta?' }}
        <a href="#" @click.prevent="isSignUp = !isSignUp">
          {{ isSignUp ? 'Entrar' : 'Criar conta' }}
        </a>
      </p>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { signIn, signUp } = useAuth()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const { error } = isSignUp.value 
      ? await signUp(email.value, password.value)
      : await signIn(email.value, password.value)
    
    if (error) {
      errorMessage.value = error.message
    } else if (isSignUp.value) {
      successMessage.value = 'Conta criada! Verifique seu email.'
    }
  } catch (err) {
    errorMessage.value = 'Erro ao processar requisição'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-container h1 {
  color: white;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.toggle-mode {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.toggle-mode a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.toggle-mode a:hover {
  text-decoration: underline;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.success-message {
  color: #27ae60;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>
