<template>
  <div class="totals-summary">
    <h3>💸 Resumo</h3>
    
    <div class="totals-grid">
      <div class="total-item income">
        <div class="total-label">Total de Rendas</div>
        <div class="total-value">R$ {{ formatAmount(totalIncome) }}</div>
      </div>
      
      <div class="total-item obligations">
        <div class="total-label">Total de Obrigações</div>
        <div class="total-value">R$ {{ formatAmount(totalObligations) }}</div>
      </div>
      
      <div class="total-item surplus" :class="surplusClass">
        <div class="total-label">Sobra</div>
        <div class="total-value">R$ {{ formatAmount(surplus) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalIncome: {
    type: Number,
    required: true
  },
  totalObligations: {
    type: Number,
    required: true
  },
  surplus: {
    type: Number,
    required: true
  }
})

const surplusClass = computed(() => {
  if (props.surplus > 0) return 'positive'
  if (props.surplus < 0) return 'negative'
  return 'neutral'
})

const formatAmount = (amount) => {
  return amount.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.totals-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.totals-summary h3 {
  margin: 0 0 1rem 0;
  color: #667eea;
}

.totals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.total-item {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.total-item.income {
  background: linear-gradient(135deg, #d5f4e6 0%, #a8e6cf 100%);
}

.total-item.obligations {
  background: linear-gradient(135deg, #ffe5d9 0%, #ffd3ba 100%);
}

.total-item.surplus {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  font-weight: bold;
}

.total-item.surplus.positive {
  background: linear-gradient(135deg, #d5f4e6 0%, #a8e6cf 100%);
}

.total-item.surplus.negative {
  background: linear-gradient(135deg, #ffd3d3 0%, #ffb3b3 100%);
}

.total-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.positive .total-value {
  color: #27ae60;
}

.negative .total-value {
  color: #e74c3c;
}
</style>
