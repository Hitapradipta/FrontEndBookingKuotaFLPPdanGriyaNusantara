<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-white mb-6">Dashboard Kuota FLPP</h1>

    <!-- Section 1: Visual Charts (Using Vuetify Components) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pie Chart Representation: Sisa Kuota per Bank -->
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center">
            <VIcon icon="tabler-chart-pie" class="me-2" />
            Chart Kuota per Bank
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <div class="pie-chart-representation">
            <div class="chart-container">
              <!-- Pie chart using CSS -->
              <div class="pie-chart" :style="pieChartStyle">
                <div class="chart-center">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold">Total</div>
                    <div class="text-subtitle-1">{{ formatCurrency(totalKuotaAllBank) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-legend mt-4">
              <div v-for="(bank, index) in banksData" :key="index" class="legend-item d-flex align-center mb-2">
                <div 
                  class="legend-color me-2" 
                  :style="{ backgroundColor: chartColors[index] }"
                ></div>
                <div class="text-caption">
                  {{ bank.namaMitra }}: {{ formatCurrency(bank.sisaKuota) }}
                </div>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>

      <!-- Bar Chart Representation: Pengajuan Kuota per Bulan -->
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center">
            <VIcon icon="tabler-chart-bar" class="me-2" />
            Pengajuan Kuota per Bulan
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <div class="bar-chart-representation">
            <div class="d-flex align-items-end mb-2" style="height: 200px;">
              <div 
                v-for="(item, index) in pengajuanPerBulan" 
                :key="index"
                class="bar-item me-2 text-center"
                style="flex: 1;"
              >
                <div 
                  class="bar bg-primary"
                  :style="{ 
                    height: `${(item.total / maxPengajuan) * 180}px`,
                    backgroundColor: barColors[index]
                  }"
                ></div>
                <div class="text-caption mt-1">{{ item.bulan }}</div>
                <div class="text-caption font-weight-bold">
                  {{ formatCurrency(item.total).replace('Rp', '').replace(/\D/g, '').slice(0, -9) }}M
                </div>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </div>

    <!-- Section 2: Statistik Kecil -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <!-- Statistik Sisa Kuota FLPP -->
      <VCard color="primary" class="text-white">
        <VCardText>
          <div class="d-flex justify-space-between align-center">
            <div>
              <VIcon icon="tabler-cash" size="24" />
              <div class="text-subtitle-1 mt-1">Sisa Kuota FLPP</div>
            </div>
            <div class="text-h6 font-weight-bold">
              {{ formatCurrency(totalKuotaSisa) }}
            </div>
          </div>
        </VCardText>
      </VCard>

      <!-- Statistik Disetujui -->
      <VCard color="success" class="text-white">
        <VCardText>
          <div class="d-flex justify-space-between align-center">
            <div>
              <VIcon icon="tabler-check-circle" size="24" />
              <div class="text-subtitle-1 mt-1">Disetujui</div>
            </div>
            <div class="text-h6 font-weight-bold">
              {{ jumlahDisetujui }}
            </div>
          </div>
        </VCardText>
      </VCard>

      <!-- Statistik Ditolak -->
      <VCard color="error" class="text-white">
        <VCardText>
          <div class="d-flex justify-space-between align-center">
            <div>
              <VIcon icon="tabler-close-circle" size="24" />
              <div class="text-subtitle-1 mt-1">Ditolak</div>
            </div>
            <div class="text-h6 font-weight-bold">
              {{ jumlahDitolak }}
            </div>
          </div>
        </VCardText>
      </VCard>
    </div>

    <!-- Section 3: Tabel Data -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Tabel: Total Pengajuan Kuota per Bank -->
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center">
            <VIcon icon="tabler-bank" class="me-2" />
            Total Pengajuan Kuota per Bank
          </VCardTitle>
        </VCardItem>
        <VTable class="submission-table">
          <thead>
            <tr>
              <th>Nama Mitra</th>
              <th>Kuota</th>
              <th>Pengajuan</th>
              <th>Sisa Kuota</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(bank, index) in banksData" :key="index">
              <td>{{ bank.namaMitra }}</td>
              <td>{{ formatCurrency(bank.kuota) }}</td>
              <td>{{ bank.pengajuan }}</td>
              <td>{{ formatCurrency(bank.sisaKuota) }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCard>

      <!-- Tabel: Total Pengajuan Kuota per Bulan -->
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center">
            <VIcon icon="tabler-calendar" class="me-2" />
            Total Pengajuan Kuota per Bulan
          </VCardTitle>
        </VCardItem>
        <VTable class="submission-table">
          <thead>
            <tr>
              <th>Bulan</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(bulan, index) in pengajuanPerBulan" :key="index">
              <td>{{ bulan.bulan }}</td>
              <td>{{ formatCurrency(bulan.total) }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    VCard,
    VCardItem,
    VCardText,
    VCardTitle,
    VIcon,
    VTable
} from 'vuetify/lib/components/index.mjs'

// Mock data
const banksData = ref([
  { namaMitra: 'Bank Nano', kuota: 500000000, pengajuan: 0, sisaKuota: 500000000 },
  { namaMitra: 'Bank X Nusantara', kuota: 1000000000, pengajuan: 37500000000, sisaKuota: 62500000000 },
  { namaMitra: 'Bank ABC', kuota: 750000000, pengajuan: 20000000000, sisaKuota: 55000000000 },
  { namaMitra: 'Bank XYZ', kuota: 1200000000, pengajuan: 45000000000, sisaKuota: 75000000000 },
])

const pengajuanPerBulan = ref([
  { bulan: 'Juni', total: 37500000000 },
  { bulan: 'Juli', total: 25000000000 },
  { bulan: 'Agustus', total: 42000000000 },
  { bulan: 'September', total: 31000000000 },
  { bulan: 'Oktober', total: 55000000000 },
])

// Chart colors
const chartColors = ref([
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
])

const barColors = ref([
  '#1e88e5', '#4caf50', '#ff9800', '#f44336', '#9c27b0'
])

// Computed properties
const totalKuotaSisa = computed(() => {
  return banksData.value.reduce((total, bank) => total + bank.sisaKuota, 0)
})

const totalKuotaAllBank = computed(() => {
  return banksData.value.reduce((total, bank) => total + bank.kuota, 0)
})

const maxPengajuan = computed(() => {
  return Math.max(...pengajuanPerBulan.value.map(item => item.total))
})

const jumlahDisetujui = ref(1)
const jumlahDitolak = ref(0)

// Methods
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Pie chart style
const pieChartStyle = computed(() => {
  const total = totalKuotaAllBank.value
  let cumulativePercentage = 0
  const gradients = banksData.value.map((bank, index) => {
    const start = cumulativePercentage
    const percentage = (bank.kuota / total) * 100
    cumulativePercentage += percentage
    return `${chartColors.value[index]} ${start}%, ${chartColors.value[index]} ${cumulativePercentage}%`
  })
  
  return {
    background: `conic-gradient(${gradients.join(', ')})`
  }
})
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
}

.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-legend {
  width: 100%;
}

.legend-item {
  margin-bottom: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.bar-chart-representation {
  padding: 20px 0;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar {
  width: 100%;
  min-height: 10px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.submission-table th {
  background-color: #1e1e1e !important;
  color: white !important;
  font-weight: 600;
  padding: 12px 16px !important;
}

.submission-table td {
  padding: 12px 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.submission-table tr:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
