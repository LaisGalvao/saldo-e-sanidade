import { ref, computed, watch } from 'vue'
import { supabase } from './useSupabase'

export function useMonthlyPlan(userId, selectedMonth) {
  const incomes = ref([])
  const obligations = ref([])
  const rules = ref([])
  const loading = ref(false)

  // Real-time calculations
  const totalIncome = computed(() => {
    return incomes.value.reduce((sum, income) => sum + (income.amount || 0), 0)
  })

  const totalObligations = computed(() => {
    return obligations.value
      .filter(ob => ob.status !== 'ignored')
      .reduce((sum, ob) => sum + (ob.adjusted_amount || ob.amount || 0), 0)
  })

  const surplus = computed(() => {
    return totalIncome.value - totalObligations.value
  })

  // Load data for the selected month
  const loadMonthData = async () => {
    if (!userId.value || !selectedMonth.value) return
    
    loading.value = true
    try {
      // Load incomes
      const { data: incomesData } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', userId.value)
        .eq('month', selectedMonth.value)
        .order('created_at', { ascending: true })
      
      incomes.value = incomesData || []

      // Load obligations
      const { data: obligationsData } = await supabase
        .from('obligations')
        .select('*')
        .eq('user_id', userId.value)
        .eq('month', selectedMonth.value)
        .order('created_at', { ascending: true })
      
      obligations.value = obligationsData || []

      // Load rules
      const { data: rulesData } = await supabase
        .from('rules')
        .select('*')
        .eq('user_id', userId.value)
        .eq('month', selectedMonth.value)
        .order('created_at', { ascending: true })
      
      rules.value = rulesData || []
    } catch (error) {
      console.error('Error loading month data:', error)
    } finally {
      loading.value = false
    }
  }

  // CRUD operations for incomes
  const addIncome = async (description, amount) => {
    const { data, error } = await supabase
      .from('incomes')
      .insert({
        user_id: userId.value,
        month: selectedMonth.value,
        description,
        amount
      })
      .select()
    
    if (!error && data) {
      incomes.value.push(data[0])
    }
    return { data, error }
  }

  const updateIncome = async (id, updates) => {
    const { data, error } = await supabase
      .from('incomes')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (!error && data) {
      const index = incomes.value.findIndex(i => i.id === id)
      if (index !== -1) {
        incomes.value[index] = data[0]
      }
    }
    return { data, error }
  }

  const deleteIncome = async (id) => {
    const { error } = await supabase
      .from('incomes')
      .delete()
      .eq('id', id)
    
    if (!error) {
      incomes.value = incomes.value.filter(i => i.id !== id)
    }
    return { error }
  }

  // CRUD operations for obligations
  const addObligation = async (description, amount) => {
    const { data, error } = await supabase
      .from('obligations')
      .insert({
        user_id: userId.value,
        month: selectedMonth.value,
        description,
        amount,
        status: 'pending',
        adjusted_amount: amount
      })
      .select()
    
    if (!error && data) {
      obligations.value.push(data[0])
    }
    return { data, error }
  }

  const updateObligation = async (id, updates) => {
    const { data, error } = await supabase
      .from('obligations')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (!error && data) {
      const index = obligations.value.findIndex(o => o.id === id)
      if (index !== -1) {
        obligations.value[index] = data[0]
      }
    }
    return { data, error }
  }

  const deleteObligation = async (id) => {
    const { error } = await supabase
      .from('obligations')
      .delete()
      .eq('id', id)
    
    if (!error) {
      obligations.value = obligations.value.filter(o => o.id !== id)
    }
    return { error }
  }

  const updateObligationStatus = async (id, status, adjustedAmount = null) => {
    const updates = { status }
    if (adjustedAmount !== null) {
      updates.adjusted_amount = adjustedAmount
    }
    return updateObligation(id, updates)
  }

  // CRUD operations for rules
  const addRule = async (description, amount) => {
    const { data, error } = await supabase
      .from('rules')
      .insert({
        user_id: userId.value,
        month: selectedMonth.value,
        description,
        amount
      })
      .select()
    
    if (!error && data) {
      rules.value.push(data[0])
    }
    return { data, error }
  }

  const updateRule = async (id, updates) => {
    const { data, error } = await supabase
      .from('rules')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (!error && data) {
      const index = rules.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rules.value[index] = data[0]
      }
    }
    return { data, error }
  }

  const deleteRule = async (id) => {
    const { error } = await supabase
      .from('rules')
      .delete()
      .eq('id', id)
    
    if (!error) {
      rules.value = rules.value.filter(r => r.id !== id)
    }
    return { error }
  }

  // Watch for month changes and reload data
  watch([userId, selectedMonth], () => {
    loadMonthData()
  }, { immediate: true })

  return {
    incomes,
    obligations,
    rules,
    loading,
    totalIncome,
    totalObligations,
    surplus,
    loadMonthData,
    addIncome,
    updateIncome,
    deleteIncome,
    addObligation,
    updateObligation,
    deleteObligation,
    updateObligationStatus,
    addRule,
    updateRule,
    deleteRule
  }
}
