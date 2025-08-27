```vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-black">Manajemen Kuota</h1>
      <div class="flex items-center space-x-9">
        <!-- Tombol Tambah Kuota Induk -->
        <VBtn 
          color="primary" 
          @click="openAddQuotaDialog"
          prepend-icon="tabler-plus"
        >
          Tambah Kuota Induk
        </VBtn>
      </div>
    </div>

    <!-- Dialog Tambah/Edit Kuota Induk -->
    <VDialog v-model="quotaDialog" max-width="600px">
      <VCard>
        <VCardTitle>
          <span class="text-h5">{{ quotaFormTitle }}</span>
        </VCardTitle>
        <VCardText>
          <VForm ref="quotaForm" v-model="quotaFormValid">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="editedQuota.year"
                  label="Tahun"
                  :rules="[v => !!v || 'Tahun harus diisi', v => v > 2000 || 'Tahun tidak valid']"
                  required
                  type="number"
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedQuota.endDate"
                  label="Tanggal Berakhir"
                  :rules="[v => !!v || 'Tanggal berakhir harus diisi']"
                  required
                  readonly
                  @click="openDatePicker"
                ></VTextField>
                <div class="text-sm text-gray-500 mt-1">
                  {{ displayDate || 'Belum dipilih' }}
                </div>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedQuota.totalQuota"
                  label="Total Kuota"
                  :rules="[v => !!v || 'Total kuota harus diisi', v => v > 0 || 'Total kuota harus lebih dari 0']"
                  required
                  type="number"
                  prefix="Rp"
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedQuota.utilizationPercentage"
                  label="Persentase Utilisasi (%)"
                  :rules="[v => v >= 0 && v <= 100 || 'Persentase harus antara 0-100']"
                  required
                  type="number"
                ></VTextField>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeQuotaDialog">
            Batal
          </VBtn>
          <VBtn color="blue-darken-1" variant="text" @click="saveQuota">
            Simpan
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Date Picker Dialog -->
    <VDialog v-model="datePickerDialog" max-width="400px">
      <VCard>
        <VCardText>
          <div style="min-width:320px;">
            <VDatePicker
              v-model="selectedDate"
              width="100%"
              @update:model-value="onDateSelected"
            ></VDatePicker>
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeDatePicker">
            Batal
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog Konfirmasi Hapus -->
    <VDialog v-model="deleteDialog" max-width="450px">
      <VCard>
        <VCardTitle class="text-h5">
          Konfirmasi Hapus
        </VCardTitle>
        <VCardText>
          Apakah Anda yakin mau menghapus kuota induk ini?
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeDeleteDialog">
            Batal
          </VBtn>
          <VBtn color="error" variant="text" @click="confirmDelete">
            Hapus
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog Lihat Mitra -->
    <VDialog v-model="mitraDialog" max-width="800px">
      <VCard>
        <VCardTitle>
          <span class="text-h5">Daftar Mitra - Kuota Induk {{ selectedQuota?.year }}</span>
        </VCardTitle>
        <VCardText>
          <VTable>
            <thead>
              <tr>
                <th>Nama Mitra</th>
                <th>Kuota</th>
                <th>Utilisasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mitra, index) in selectedQuotaMitra" :key="index">
                <td>{{ mitra.name }}</td>
                <td>{{ formatCurrency(mitra.quota) }}</td>
                <td>{{ mitra.utilization }}%</td>
                <td>
                  <VBtn 
                    color="primary" 
                    size="small"
                    @click="viewMitraDetail(mitra.id)"
                  >
                    Detail
                  </VBtn>
                </td>
              </tr>
              <tr v-if="selectedQuotaMitra.length === 0">
                <td colspan="4" class="text-center">
                  Belum ada mitra yang terdaftar
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeMitraDialog">
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Konten Utama -->
    <VCard>
      <VTable class="submission-table">
        <tbody>
          <tr v-for="(quota, index) in displayedQuotas" :key="index">
            <td colspan="2">
              <div class="border-b border-gray-200 py-4">
                <p class="text-sm text-gray-500">
                  Kuota Induk Tahun {{ quota.year }} sampai dengan {{ formatDisplayDate(quota.endDate) }}
                </p>
                <h2 class="text-4xl font-bold">{{ formatCurrency(quota.totalQuota) }}</h2>
                <p class="text-sm text-gray-500">
                  Persentase Utilisasi telah mencapai {{ quota.utilizationPercentage }}%
                </p>
                <div class="flex items-center space-x-4 mt-2">
                  <a 
                    href="javascript:void(0)" 
                    class="text-primary cursor-pointer"
                    @click="viewMitraList(quota)"
                  >
                    Lihat Kuota Mitra ({{ quota.mitraCount }})
                  </a>
                  <div class="flex space-x-2">
                    <VBtn 
                      color="warning" 
                      icon="tabler-edit" 
                      size="large"
                      @click="editQuota(quota)"
                    ></VBtn>
                    <VBtn 
                      color="error" 
                      icon="tabler-trash" 
                      size="large"
                      @click="openDeleteDialog(quota, index)"
                    ></VBtn>
                  </div>
                </div>
              </div>
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
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router'; // [!code ++] // Impor useRouter untuk routing
import { VDatePicker } from 'vuetify/labs/VDatePicker';

import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VCol,
  VDialog,
  VForm,
  VPagination,
  VRow,
  VSpacer,
  VTable,
  VTextField
} from 'vuetify/lib/components/index.mjs';

const router = useRouter()

// Mock data - nanti akan diambil dari store atau API
const quotas = ref([
  {
    id: 1,
    year: 2025,
    endDate: '2025-07-28',
    totalQuota: 962500000,
    utilizationPercentage: 3.75,
    mitraCount: 0,
    mitra: []
  },
  {
    id: 2,
    year: 2024,
    endDate: '2024-07-28',
    totalQuota: 650625000000,
    utilizationPercentage: 7.05,
    mitraCount: 1,
    mitra: [
      {
        id: 1,
        name: 'Bank X Nusantara',
        quota: 1000000000,
        utilization: 37.5
      }
    ]
  },
])

// State untuk dialog kuota
const quotaDialog = ref(false)
const datePickerDialog = ref(false)
const quotaFormValid = ref(false)
const quotaForm = ref(null)
const editedIndex = ref(-1)
const editedQuota = ref({
  id: 0,
  year: new Date().getFullYear(),
  endDate: '',
  totalQuota: 0,
  utilizationPercentage: 0,
  mitraCount: 0,
  mitra: []
})

const selectedDate = ref<any[]>([])

// State untuk paginasi
const itemsPerPage = ref(20)
const currentPage = ref(1)

// Computed properties untuk paginasi
const totalItems = computed(() => quotas.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const firstItem = computed(() => {
  return totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
})

const lastItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
})

const displayedQuotas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return quotas.value.slice(start, end)
})

// State untuk dialog delete
const deleteDialog = ref(false)
const quotaToDelete = ref<any>(null)
const quotaToDeleteIndex = ref(-1)

// State untuk dialog mitra
const mitraDialog = ref(false)
const selectedQuota = ref<any>(null)

// Computed
const quotaFormTitle = computed(() => {
  return editedIndex.value === -1 ? 'Tambah Kuota Induk' : 'Edit Kuota Induk'
})

const selectedQuotaMitra = computed(() => {
  return selectedQuota.value?.mitra || []
})

const displayDate = computed(() => {
  if (!editedQuota.value.endDate) return ''
  return formatDisplayDate(editedQuota.value.endDate)
})

// Methods
function formatCurrency(amount: number): string {
  return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function formatDisplayDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  
  const dayName = days[date.getDay()]
  const day = date.getDate().toString().padStart(2, '0')
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()
  
  return `${dayName}, ${day} ${monthName} ${year}`
}

function openAddQuotaDialog() {
  editedIndex.value = -1
  editedQuota.value = {
    id: 0,
    year: new Date().getFullYear(),
    endDate: '',
    totalQuota: 0,
    utilizationPercentage: 0,
    mitraCount: 0,
    mitra: []
  }
  quotaDialog.value = true
}

function editQuota(quota: any) {
  editedIndex.value = quotas.value.indexOf(quota)
  editedQuota.value = { ...quota }
  quotaDialog.value = true
}

function closeQuotaDialog() {
  quotaDialog.value = false
}

function openDatePicker() {
  if (editedQuota.value.endDate) {
    selectedDate.value = [editedQuota.value.endDate]
  } else {
    selectedDate.value = [new Date().toISOString().split('T')[0]]
  }
  datePickerDialog.value = true
}

function closeDatePicker() {
  datePickerDialog.value = false
}

function onDateSelected(value: readonly any[]) {
  const date = Array.isArray(value) ? value[0] : value
  if (date) {
    editedQuota.value.endDate = date
  }
  closeDatePicker()
}

function saveQuota() {
  if (quotaFormValid.value) {
    if (editedIndex.value > -1) {
      // Update existing quota
      Object.assign(quotas.value[editedIndex.value], editedQuota.value)
    } else {
      // Add new quota
      const newQuota = {
        ...editedQuota.value,
        id: Math.max(...quotas.value.map(q => q.id), 0) + 1
      }
      quotas.value.push(newQuota)
    }
    closeQuotaDialog()
  }
}

function openDeleteDialog(quota: any, index: number) {
  quotaToDelete.value = quota
  quotaToDeleteIndex.value = index
  deleteDialog.value = true
}

function closeDeleteDialog() {
  deleteDialog.value = false
  quotaToDelete.value = null
  quotaToDeleteIndex.value = -1
}

function confirmDelete() {
  if (quotaToDelete.value && quotaToDeleteIndex.value > -1) {
    quotas.value.splice(quotaToDeleteIndex.value, 1)
  }
  closeDeleteDialog()
}

function viewMitraList(quota: any) {
  // router.push(`/activity-log/view-kuota-mitra/${quota.id}`)
  console.log('Viewing mitra list for quota:', quota)
  router.push({ name: 'activity-log-view-kuota-mitra-id', params: { id: quota.id } })

}

function closeMitraDialog() {
  mitraDialog.value = false
  selectedQuota.value = null
}

function viewMitraDetail(mitraId: number) {
  // router.push(`/activity-log/view-kuota-mitra/${mitraId}`)
  // router.push({ name: 'activity-log-view-kuota-mitra', params: { id: mitraId } })
}

</script>

<style scoped>
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
</style>
