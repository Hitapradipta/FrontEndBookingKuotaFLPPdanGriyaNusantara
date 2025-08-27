<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-black">Status Pengajuan Kuota FLPP</h1>
      <div class="flex items-center space-x-4">
      </div>
    </div>

    <!-- Tabel Status Pengajuan -->
    <VCard>
      <VTable class="submission-table">
        <thead>
          <tr>
            <th class="text-left">
              <div class="flex items-center">
                Log Activity
                <VIcon icon="tabler-arrow-up-down" size="16" class="ml-1 cursor-pointer" />
              </div>
            </th>
            <th class="text-left">
              <div class="flex items-center">
                Nama Mitra
                <VIcon icon="tabler-arrow-up-down" size="16" class="ml-1 cursor-pointer" />
              </div>
            </th>
            <th class="text-left">
              <div class="flex items-center">
                Tanggal Permohonan
                <VIcon icon="tabler-arrow-up-down" size="16" class="ml-1 cursor-pointer" />
              </div>
            </th>
            <th class="text-right">
              <div class="flex items-center justify-end">
                Nominal Porsi 100%
                <VIcon icon="tabler-arrow-up-down" size="16" class="ml-1 cursor-pointer" />
              </div>
            </th>
            <th class="text-right">
              <div class="flex items-center justify-end">
                Nominal Porsi 25%
                <VIcon icon="tabler-arrow-up-down" size="16" class="ml-1 cursor-pointer" />
              </div>
            </th>
            <th class="text-left">
              <div class="flex items-center">
                Status
                <VIcon icon="tabler-arrow-up-down" size="16" class="ml-1 cursor-pointer" />
              </div>
            </th>
            <th class="text-left">File Terkait</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedItems" :key="index">
            <td>
              <!-- Tombol Log Activity dengan popup -->
              <VBtn
                variant="text"
                color="primary"
                size="small"
                class="px-0"
                @click="openLogActivityModal(item.id)"
              >
                <div class="flex items-center">
                  <VIcon icon="tabler-magnify" size="18" class="mr-2" />
                  Log Activity ({{ item.logActivity.length }})
                </div>
              </VBtn>
            </td>
            <td>{{ item.namaMitra }}</td>
            <td>{{ formatDate(item.tanggalPermohonan) }}</td>
            <td class="text-right font-medium">
              {{ formatCurrency(item.nominalPorsi100) }}
            </td>
            <td class="text-right font-medium">
              {{ formatCurrency(item.nominalPorsi25) }}
            </td>
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
                v-if="item.uploadedFile"
                variant="text"
                color="primary"
                size="small"
                @click="viewFile(item.uploadedFile)"
              >
                <VIcon icon="tabler-file-document-outline" size="18" class="mr-1" />
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

    <!-- Dialog Log Activity -->
    <VDialog v-model="logActivityDialog" max-width="800px">
      <VCard>
        <VCardTitle>
          <span class="text-h5">Log Activity - {{ selectedSubmission?.namaMitra }}</span>
        </VCardTitle>
        <VCardText>
          <VTable fixed-header height="300px">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>User</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in selectedSubmission?.logActivity || []" :key="index">
                <td>{{ formatDate(log.startDate) }}</td>
                <td>{{ formatDate(log.endDate) }}</td>
                <td>{{ log.status }}</td>
                <td>{{ log.user }}</td>
                <td>{{ log.comment }}</td>
              </tr>
              <tr v-if="!(selectedSubmission?.logActivity && selectedSubmission.logActivity.length)">
                <td colspan="5" class="text-center">
                  Tidak ada log activity
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeLogActivityModal">
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  VBtn,
  VCard,
  VChip,
  VDialog,
  VIcon,
  VPagination,
  VTable
} from 'vuetify/lib/components/index.mjs'

const router = useRouter()

// Mock data - nanti akan diambil dari store atau API
const submittedData = ref<any[]>([
  {
    id: 1,
    logActivity: [
      { startDate: '2024-01-15 10:00:00', endDate: '2024-01-15 10:05:00', status: 'Dalam Pengajuan', user: 'Bank X Indonesia', comment: '' },
      { startDate: '2024-01-15 10:05:00', endDate: '2024-01-15 10:10:00', status: 'Sedang di Proses', user: 'Fajar Ibu Sina', comment: '' },
      { startDate: '2024-01-15 10:10:00', endDate: '2024-01-15 10:15:00', status: 'Disetujui', user: 'Ajie Budiman', comment: '' }
    ],
    namaMitra: 'Bank X Indonesia',
    tanggalPermohonan: '2024-01-15',
    nominalPorsi100: 1000000000,
    nominalPorsi25: 250000000,
    status: 'Disetujui',
    uploadedFile: {
      name: 'surat_notifikasi_001.pdf',
      url: '/files/surat_notifikasi_001.pdf'
    }
  },
  {
    id: 2,
    logActivity: [
      { startDate: '2024-01-14 09:00:00', endDate: '2024-01-14 09:05:00', status: 'Ditolak', user: 'Bank Y Nasional', comment: 'Kuota melebihi batas' }
    ],
    namaMitra: 'Bank Y Nasional',
    tanggalPermohonan: '2024-01-14',
    nominalPorsi100: 750000000,
    nominalPorsi25: 187500000,
    status: 'Pending',
    uploadedFile: {
      name: 'surat_notifikasi_002.pdf',
      url: '/files/surat_notifikasi_002.pdf'
    }
  },
  {
    id: 3,
    logActivity: [],
    namaMitra: 'Bank Z Internasional',
    tanggalPermohonan: '2024-01-13',
    nominalPorsi100: 500000000,
    nominalPorsi25: 125000000,
    status: 'Ditolak',
    uploadedFile: null
  }
])

// State untuk paginasi
const itemsPerPage = ref(10)
const currentPage = ref(1)

// State untuk dialog log activity
const logActivityDialog = ref(false)
const selectedSubmission = ref<any>(null)

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
    minute: '2-digit',
    second: '2-digit'
  })
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'disetujui':
      return 'success'
    case 'pending':
      return 'warning'
    case 'ditolak':
      return 'error'
    default:
      return 'default'
  }
}

function viewFile(file: any) {
  if (file && file.url) {
    // Buka file di tab baru
    window.open(file.url, '_blank')
  }
}

// Fungsi untuk membuka modal log activity
function openLogActivityModal(submissionId: number) {
  selectedSubmission.value = submittedData.value.find((item) => item.id === submissionId)
  logActivityDialog.value = true
}

// Fungsi untuk menutup modal log activity
function closeLogActivityModal() {
  logActivityDialog.value = false
  selectedSubmission.value = null
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

/* Style untuk tabel log activity */
.VTable.fixed-header {
  overflow-y: auto;
  max-height: 300px;
}

.VTable.fixed-header thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #1e1e1e;
}

.VTable.fixed-header tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
