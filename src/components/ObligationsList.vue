<template>
  <div class="obligations-manager">
    <h3>📋 Obrigações</h3>
    
    <div class="add-form">
      <input 
        v-model="newDescription" 
        type="text" 
        placeholder="Descrição (ex: Aluguel)"
        @keyup.enter="handleAdd"
      />
      <input 
        v-model.number="newAmount" 
        type="number" 
        step="0.01"
        placeholder="Valor"
        @keyup.enter="handleAdd"
      />
      <button @click="handleAdd" class="btn-add">+</button>
    </div>

    <div class="items-list">
      <div v-for="obligation in obligations" :key="obligation.id" class="item" :class="`status-${obligation.status}`">
        <div class="item-info">
          <span class="item-description">{{ obligation.description }}</span>
          <div class="item-amounts">
            <span class="item-amount original" v-if="obligation.adjusted_amount !== obligation.amount">
              <s>R$ {{ formatAmount(obligation.amount) }}</s>
            </span>
            <span class="item-amount">R$ {{ formatAmount(obligation.adjusted_amount || obligation.amount) }}</span>
          </div>
        </div>
        
        <div class="item-actions">
          <select 
            :value="obligation.status" 
            @change="handleStatusChange(obligation.id, $event.target.value)"
            class="status-select"
          >
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="ignored">Ignorar</option>
          </select>
          
          <button 
            v-if="!editingId || editingId !== obligation.id"
            @click="startEdit(obligation)" 
            class="btn-edit"
            title="Ajustar valor"
          >
            ✎
          </button>
          
          <input 
            v-if="editingId === obligation.id"
            v-model.number="editAmount"
            type="number"
            step="0.01"
            class="edit-input"
            @keyup.enter="saveEdit(obligation.id)"
            @blur="saveEdit(obligation.id)"
            autofocus
          />
          
          <button @click="handleDelete(obligation.id)" class="btn-delete">✕</button>
        </div>
      </div>
      
      <div v-if="obligations.length === 0" class="empty-state">
        Nenhuma obrigação cadastrada
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  obligations: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add', 'delete', 'updateStatus'])

const newDescription = ref('')
const newAmount = ref('')
const editingId = ref(null)
const editAmount = ref(0)

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

const handleStatusChange = (id, status) => {
  emit('updateStatus', id, status)
}

const startEdit = (obligation) => {
  editingId.value = obligation.id
  editAmount.value = obligation.adjusted_amount || obligation.amount
}

const saveEdit = (id) => {
  if (editingId.value === id) {
    const newAmount = parseFloat(editAmount.value)
    if (!isNaN(newAmount) && newAmount >= 0) {
      emit('updateStatus', id, null, newAmount)
      editingId.value = null
    }
  }
}

const formatAmount = (amount) => {
  return amount.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.obligations-manager {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.obligations-manager h3 {
  margin: 0 0 1rem 0;
  color: #e67e22;
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
  border-color: #e67e22;
}

.btn-add {
  padding: 0.5rem 1rem;
  background: #e67e22;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
}

.btn-add:hover {
  background: #d35400;
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
  border-left: 4px solid #e67e22;
  transition: all 0.3s;
}

.item.status-paid {
  border-left-color: #27ae60;
  background: #d5f4e6;
}

.item.status-ignored {
  border-left-color: #95a5a6;
  background: #ecf0f1;
  opacity: 0.7;
}

.item:hover {
  transform: translateX(2px);
}

.item-info {
  display: flex;
  gap: 1rem;
  flex: 1;
  align-items: center;
}

.item-description {
  flex: 1;
  color: #333;
}

.item-amounts {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.item-amount {
  font-weight: 600;
  color: #e67e22;
}

.item-amount.original {
  font-size: 0.85rem;
  color: #999;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.status-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-edit {
  padding: 0.25rem 0.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-edit:hover {
  background: #2980b9;
}

.edit-input {
  width: 80px;
  padding: 0.25rem;
  border: 2px solid #3498db;
  border-radius: 3px;
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
