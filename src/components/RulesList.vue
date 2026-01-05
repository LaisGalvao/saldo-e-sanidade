<template>
  <div class="rules-manager">
    <h3>📝 Regras</h3>
    
    <div class="add-form">
      <input 
        v-model="newDescription" 
        type="text" 
        placeholder="Descrição (ex: Reserva de emergência)"
        @keyup.enter="handleAdd"
      />
      <input 
        v-model.number="newAmount" 
        type="number" 
        step="0.01"
        placeholder="Valor ou %"
        @keyup.enter="handleAdd"
      />
      <button @click="handleAdd" class="btn-add">+</button>
    </div>

    <div class="items-list">
      <div v-for="rule in rules" :key="rule.id" class="item">
        <div class="item-info">
          <span class="item-description">{{ rule.description }}</span>
          <span class="item-amount">R$ {{ formatAmount(rule.amount) }}</span>
        </div>
        <button @click="handleDelete(rule.id)" class="btn-delete">✕</button>
      </div>
      
      <div v-if="rules.length === 0" class="empty-state">
        Nenhuma regra cadastrada
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  rules: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add', 'delete'])

const newDescription = ref('')
const newAmount = ref('')

const handleAdd = () => {
  if (newDescription.value && newAmount.value) {
    emit('add', newDescription.value, parseFloat(newAmount.value))
    newDescription.value = ''
    newAmount.value = ''
  }
}

const handleDelete = (id) => {
  emit('delete', id)
}

const formatAmount = (amount) => {
  return amount.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.rules-manager {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.rules-manager h3 {
  margin: 0 0 1rem 0;
  color: #9b59b6;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-form input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.add-form input:focus {
  outline: none;
  border-color: #9b59b6;
}

.btn-add {
  padding: 0.5rem 1rem;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
}

.btn-add:hover {
  background: #8e44ad;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 5px;
  transition: background 0.3s;
}

.item:hover {
  background: #e9ecef;
}

.item-info {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.item-description {
  flex: 1;
  color: #333;
}

.item-amount {
  font-weight: 600;
  color: #9b59b6;
}

.btn-delete {
  padding: 0.25rem 0.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-delete:hover {
  background: #c0392b;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}
</style>
