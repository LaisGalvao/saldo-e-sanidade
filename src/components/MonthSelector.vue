<template>
  <div class="month-selector">
    <button @click="previousMonth" class="nav-btn">◀</button>
    <input 
      type="month" 
      v-model="localMonth" 
      @change="$emit('update:modelValue', localMonth)"
      class="month-input"
    />
    <button @click="nextMonth" class="nav-btn">▶</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const localMonth = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localMonth.value = newValue
})

const previousMonth = () => {
  const [year, month] = localMonth.value.split('-').map(Number)
  const date = new Date(year, month - 2)
  localMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  emit('update:modelValue', localMonth.value)
}

const nextMonth = () => {
  const [year, month] = localMonth.value.split('-').map(Number)
  const date = new Date(year, month)
  localMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  emit('update:modelValue', localMonth.value)
}
</script>

<style scoped>
.month-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.nav-btn:hover {
  background: #764ba2;
}

.month-input {
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  border: 2px solid #667eea;
  border-radius: 5px;
  text-align: center;
}
</style>
