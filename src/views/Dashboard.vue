<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Saldo & Sanidade</h1>
      <button @click="handleSignOut" class="btn-signout">Sair</button>
    </header>
    
    <div class="dashboard-content">
      <MonthSelector v-model="selectedMonth" />
      
      <div v-if="loading" class="loading">Carregando...</div>
      
      <div v-else class="planning-container">
        <TotalsSummary 
          :totalIncome="totalIncome"
          :totalObligations="totalObligations"
          :surplus="surplus"
        />
        
        <IncomeManager 
          :incomes="incomes"
          @add="handleAddIncome"
          @delete="handleDeleteIncome"
        />
        
        <ObligationsList 
          :obligations="obligations"
          @add="handleAddObligation"
          @delete="handleDeleteObligation"
          @updateStatus="handleUpdateObligationStatus"
        />
        
        <RulesList 
          :rules="rules"
          @add="handleAddRule"
          @delete="handleDeleteRule"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useMonthlyPlan } from '../composables/useMonthlyPlan'
import MonthSelector from '../components/MonthSelector.vue'
import TotalsSummary from '../components/TotalsSummary.vue'
import IncomeManager from '../components/IncomeManager.vue'
import ObligationsList from '../components/ObligationsList.vue'
import RulesList from '../components/RulesList.vue'

const { user, signOut } = useAuth()

// Initialize with current month
const now = new Date()
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

const userId = computed(() => user.value?.id)

const {
  incomes,
  obligations,
  rules,
  loading,
  totalIncome,
  totalObligations,
  surplus,
  addIncome,
  deleteIncome,
  addObligation,
  deleteObligation,
  updateObligationStatus,
  addRule,
  deleteRule
} = useMonthlyPlan(userId, selectedMonth)

const handleAddIncome = async (description, amount) => {
  await addIncome(description, amount)
}

const handleDeleteIncome = async (id) => {
  await deleteIncome(id)
}

const handleAddObligation = async (description, amount) => {
  await addObligation(description, amount)
}

const handleDeleteObligation = async (id) => {
  await deleteObligation(id)
}

const handleUpdateObligationStatus = async (id, status, adjustedAmount = null) => {
  if (status) {
    await updateObligationStatus(id, status, adjustedAmount)
  } else if (adjustedAmount !== null) {
    const obligation = obligations.value.find(o => o.id === id)
    await updateObligationStatus(id, obligation.status, adjustedAmount)
  }
}

const handleAddRule = async (description, amount) => {
  await addRule(description, amount)
}

const handleDeleteRule = async (id) => {
  await deleteRule(id)
}

const handleSignOut = async () => {
  await signOut()
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.btn-signout {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-signout:hover {
  background: white;
  color: #667eea;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.planning-container {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem;
  }
  
  .dashboard-header h1 {
    font-size: 1.4rem;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
}
</style>
