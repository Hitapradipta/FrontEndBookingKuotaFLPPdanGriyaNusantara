<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-black">Inbox</h1>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-300">
          Menampilkan {{ firstItem }} - {{ lastItem }} dari {{ totalItems }}
        </span>
        <VSelect
          v-model="itemsPerPage"
          :items="[10, 20, 50, 100]"
          density="comfortable"
          variant="outlined"
          hide-details
          class="w-32"
        />
      </div>
    </div>

    <!-- Tabel Inbox -->
    <VCard>
      <VTable class="submission-table">
        <thead>
          <tr>
            <th class="text-left">
              Aksi
            </th>
            <th class="text-left">
              Nama Mitra
            </th>
            <th class="text-left">
              Tanggal Permohonan
            </th>
            <th class="text-right">
              Nominal Porsi 100%
            </th>
            <th class="text-right">
              Nominal Porsi 25%
            </th>
            <th class="text-left">
              Status
            </th>
            <th class="text-left">
              File Surat
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedItems" :key="index">
            <td>
              <VBtn
                color="primary"
                size="small"
                @click="viewDetail(item)"
              >
                <VIcon icon="tabler-eye" class="mr-2" />
                Detail
              </VBtn>
            </td>
            <td>{{ item.namaMitra }}</td>
            <td>{{ formatDate(item.tanggalPermohonan) }}</td>
            <td class="text-right">{{ formatCurrency(item.nominalPorsi100) }}</td>
            <td class="text-right">{{ formatCurrency(item.nominalPorsi25) }}</td>
            <td>
              <VChip
                :color="getStatusColor(item.status)"
                size="small"
                variant="flat"
              >
                {{ item.status }}
              </VChip>
            </td>
            <td>
              <VBtn
                v-if="item.fileSurat"
                variant="text"
                color="primary"
                size="small"
                @click="viewFile(item.fileSurat)"
              >
                <VIcon icon="tabler-file-text" size="18" class="mr-1" />
                Lihat File
              </VBtn>
              <span v-else class="text-gray-500 text-sm">Tidak ada file</span>
            </td>
          </tr>
        </tbody>
      </VTable>

      <!-- Paginasi -->
      <div class="d-flex justify-space-between align-center pa-4 bg-background">
        <div class="text-body-2 text-medium-emphasis">
          Menampilkan {{ firstItem }} sampai {{ lastItem }} dari {{ totalItems }} data
        </div>
        <VPagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          density="comfortable"
        />
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  VBtn,
  VCard,
  VChip,
  VIcon,
  VPagination,
  VSelect,
  VTable
} from 'vuetify/lib/components/index.mjs'

const router = useRouter()

// Mock data - nanti akan diambil dari store atau API
const submittedData = ref<any[]>([
  {
    id: 1,
    namaMitra: 'Bank X Nusantara',
    tanggalPermohonan: '2023-12-15T08:36:00Z',
    nominalPorsi100: 50000000000,
    nominalPorsi25: 12500000000,
    status: 'Revisi',
    fileSurat: {
      name: 'surat_permohonan_001.pdf',
      url: '/files/surat_permohonan_001.pdf'
    }
  },
  {
    id: 2,
    namaMitra: 'Bank X Nusantara',
    tanggalPermohonan: '2023-12-15T08:36:00Z',
    nominalPorsi100: 50000000000,
    nominalPorsi25: 12500000000,
    status: 'Disetujui',
    fileSurat: {
      name: 'surat_permohonan_002.pdf',
      url: '/files/surat_permohonan_002.pdf'
    }
  },
  {
    id: 3,
    namaMitra: 'Bank 123 Aja',
    tanggalPermohonan: '2024-04-30T09:38:40Z',
    nominalPorsi100: 10000000000,
    nominalPorsi25: 2500000000,
    status: 'Dalam Pengajuan',
    fileSurat: null
  },
  {
    id: 4,
    namaMitra: 'Bank 123 Aja',
    tanggalPermohonan: '2024-04-30T09:38:40Z',
    nominalPorsi100: 10000000000,
    nominalPorsi25: 2500000000,
    status: 'Ditolak',
    fileSurat: null
  },
  {
    id: 5,
    namaMitra: 'Bank 123 Aja',
    tanggalPermohonan: '2024-04-30T09:38:40Z',
    nominalPorsi100: 10000000000,
    nominalPorsi25: 2500000000,
    status: 'Dalam Pengajuan',
    fileSurat: null
  }
])

// State untuk paginasi
const itemsPerPage = ref(20)
const currentPage = ref(1)

// Computed properties untuk paginasi
const totalItems = computed(() => submittedData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const firstItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const lastItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
})

const displayedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return submittedData.value.slice(start, end)
})

// Methods
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'disetujui':
      return 'success'
    case 'pending':
    case 'dalam pengajuan':
      return 'warning'
    case 'ditolak':
      return 'error'
    default:
      return 'default'
    case 'revisi':
      return 'info'
  }
}

// Function untuk melihat detail dengan redirect
function viewDetail(item: any) {
  console.log(`Melihat detail pengajuan ID ${item.id}`)
  
  // Redirect ke halaman detail pengajuan
  router.push({ name: 'detail-id', params: { id: item.id } })
}

function viewFile(file: any) {
  if (file && file.url) {
    // Buka file di tab baru
    window.open(file.url, '_blank')
  }
}
</script>

<style scoped>
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

.v-pagination {
  justify-content: center !important;
}

/* Style untuk tombol detail */
.detail-btn {
  text-transform: none !important;
  justify-content: flex-start !important;
}
</style>
