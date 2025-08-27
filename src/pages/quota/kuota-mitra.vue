<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-black">Kuota Mitra FLPP</h1>
      <br>
      <VBtn 
        color="primary" 
        @click="openAddDialog"
        prepend-icon="tabler-plus"
      >
        Tambah Kuota Mitra
      </VBtn>
    </div>

    <!-- Dialog Tambah/Edit Data -->
    <VDialog v-model="dataDialog" max-width="600px">
      <VCard>
        <VCardTitle>
          <span class="text-h5">{{ formTitle }}</span>
        </VCardTitle>
        <VCardText>
          <VForm ref="form" v-model="formValid">
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="editedItem.tahun"
                  label="Tahun"
                  type="number"
                  :rules="[v => !!v || 'Tahun harus diisi', v => v > 2000 || 'Tahun tidak valid']"
                  required
                ></VTextField>
              </VCol>
              <VCol cols="12" md="6">
                <VSelect
                  v-model="editedItem.bulan"
                  :items="bulanOptions"
                  item-title="text"
                  item-value="value"
                  label="Bulan"
                  :rules="[v => v !== null && v !== '' || 'Bulan harus dipilih']"
                  required
                ></VSelect>
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="editedItem.mitraId"
                  :items="mitraOptions"
                  item-title="text"
                  item-value="value"
                  label="Nama Mitra"
                  :rules="[v => !!v || 'Mitra harus dipilih']"
                  required
                ></VSelect>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="editedItem.kuotaBulanan"
                  label="Kuota Bulanan"
                  type="number"
                  :rules="[v => !!v || 'Kuota Bulanan harus diisi', v => v > 0 || 'Kuota harus lebih dari 0']"
                  required
                ></VTextField>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="editedItem.kuotaTerpakai"
                  label="Terpakai"
                  type="number"
                  :rules="[v => v >= 0 || 'Kuota terpakai tidak boleh negatif']"
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="editedItem.status"
                  :items="statusOptions"
                  label="Status"
                  :rules="[v => !!v || 'Status harus dipilih']"
                  required
                ></VSelect>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeDialog">
            Batal
          </VBtn>
          <VBtn color="blue-darken-1" variant="text" @click="saveData" :disabled="!formValid">
            Simpan
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
          Apakah Anda yakin ingin menghapus kuota bulanan ini?
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

    <!-- Informasi Kuota Induk -->
    <VCard class="mb-6">
      <VCardText>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-400">Kuota Induk Tahun 2025</p>
            <h2 class="text-2xl font-bold">{{ formatCurrency(totalQuotaInduk) }}</h2>
          </div>
          <div>
            <p class="text-sm text-gray-400">Total Kuota Tahunan Dialokasikan</p>
            <h2 class="text-2xl font-bold text-blue-600">{{ formatCurrency(totalKuotaTahunan) }}</h2>
            <VProgressLinear
              :model-value="(totalKuotaTahunan / totalQuotaInduk) * 100"
              color="blue"
              height="8"
              rounded
            ></VProgressLinear>
          </div>
          <div>
            <p class="text-sm text-gray-400">Utilisasi Tahunan</p>
            <h2 class="text-2xl font-bold">{{ utilizationPercentage }}%</h2>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- Filter -->
    <VCard class="mb-6">
      <VCardText>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <VSelect
            v-model="filterTahun"
            :items="tahunOptions"
            label="Tahun"
            clearable
          ></VSelect>
          
          <VSelect
            v-model="filterBulan"
            :items="bulanOptions"
            item-title="text"
            item-value="value"
            label="Bulan"
            clearable
          ></VSelect>
          
          <VSelect
            v-model="filterMitra"
            :items="mitraOptions"
            item-title="text"
            item-value="value"
            label="Mitra"
            clearable
          ></VSelect>
          
          <VBtn
            color="secondary"
            @click="resetFilters"
            prepend-icon="tabler-refresh"
          >
            Reset
          </VBtn>
        </div>
      </VCardText>
    </VCard>

    <!-- Konten Utama -->
    <VCard>
      <VTable class="submission-table" id="mitra-table">
        <thead>
          <tr>
            <th class="text-left">Periode</th>
            <th class="text-left">Mitra</th>
            <th class="text-right">Kuota Bulanan</th>
            <th class="text-right">Terpakai</th>
            <th class="text-right">Sisa</th>
            <th class="text-right">%</th>
            <th class="text-left">Status</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedItems" :key="index">
            <td>{{ item.tahun }}/{{ formatBulan(item.bulan) }}</td>
            <td>{{ getMitraName(item.mitraId) }}</td>
            <td class="text-right">{{ formatCurrency(item.kuotaBulanan) }}</td>
            <td class="text-right">{{ formatCurrency(item.kuotaTerpakai || 0) }}</td>
            <td class="text-right">{{ formatCurrency(item.sisaKuota) }}</td>
            <td class="text-right">{{ item.utilisasi }}%</td>
            <td>
              <VChip
                :color="getStatusColor(item.status)"
                size="small"
                variant="flat"
              >
                {{ item.status }}
              </VChip>
            </td>
            <td class="text-center">
              <VBtn
                color="warning"
                icon="tabler-edit"
                size="small"
                @click="editItem(item)"
                class="mr-1"
              ></VBtn>
              <VBtn
                color="error"
                icon="tabler-trash"
                size="small"
                @click="openDeleteDialog(item, index)"
                class="mr-1"
              ></VBtn>
              <VBtn
                color="primary"
                size="small"
                @click="viewHistory(item)"
              >
                Detail
              </VBtn>
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

    <!-- Dialog History -->
    <VDialog v-model="historyDialog" max-width="800px">
      <VCard>
        <VCardTitle>
          <span class="text-h5">History - {{ selectedItem?.tahun }}/{{ formatBulan(selectedItem?.bulan) }} - {{ getMitraName(selectedItem?.mitraId) }}</span>
        </VCardTitle>
        <VCardText>
          <VTable fixed-header height="300px">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Aktivitas</th>
                <th>User</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in selectedItem?.history || []" :key="index">
                <td>{{ formatDate(history.tanggal) }}</td>
                <td>{{ history.aktivitas }}</td>
                <td>{{ history.user }}</td>
                <td>
                  <VChip
                    :color="getStatusColor(history.status)"
                    size="small"
                    variant="flat"
                  >
                    {{ history.status }}
                  </VChip>
                </td>
              </tr>
              <tr v-if="!(selectedItem?.history && selectedItem.history.length)">
                <td colspan="4" class="text-center">
                  Tidak ada history
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeHistory">
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VDialog,
  VForm,
  VPagination,
  VProgressLinear,
  VRow,
  VSelect,
  VSpacer,
  VTable,
  VTextField
} from 'vuetify/lib/components/index.mjs'

// Filter
const filterTahun = ref<number | null>(null)
const filterBulan = ref<number | null>(null)
const filterMitra = ref<string | null>(null)

// Data kuota induk
const totalQuotaInduk = ref(1000000000000) // 1 Triliun
const utilizationPercentage = ref(15.00)

// State untuk paginasi
const itemsPerPage = ref(20)
const currentPage = ref(1)

// State untuk dialog
const dataDialog = ref(false)
const deleteDialog = ref(false)
const formValid = ref(false)
const form = ref<any>(null)

// State untuk history dialog
const historyDialog = ref(false)
const selectedItem = ref<any>(null)

// State untuk form
const editedIndex = ref(-1)
const editedItem = ref({
  id: 0,
  tahun: new Date().getFullYear(),
  bulan: new Date().getMonth() + 1,
  mitraId: '',
  kuotaBulanan: 0,
  kuotaTerpakai: 0,
  sisaKuota: 0,
  utilisasi: 0,
  status: '',
  history: [] as any[]
})

const defaultItem = {
  id: 0,
  tahun: new Date().getFullYear(),
  bulan: new Date().getMonth() + 1,
  mitraId: '',
  kuotaBulanan: 0,
  kuotaTerpakai: 0,
  sisaKuota: 0,
  utilisasi: 0,
  status: '',
  history: []
}

// State untuk delete
const itemToDelete = ref<any>(null)
const itemToDeleteIndex = ref(-1)

// Options
const statusOptions = [
  'Approved',
  'In Review',
  'Pending Approval',
  'Revisi',
  'Rejected'
]

const tahunOptions = [2022, 2023, 2024, 2025, 2026]

const bulanOptions = [
  { value: 1, text: 'Januari' },
  { value: 2, text: 'Februari' },
  { value: 3, text: 'Maret' },
  { value: 4, text: 'April' },
  { value: 5, text: 'Mei' },
  { value: 6, text: 'Juni' },
  { value: 7, text: 'Juli' },
  { value: 8, text: 'Agustus' },
  { value: 9, text: 'September' },
  { value: 10, text: 'Oktober' },
  { value: 11, text: 'November' },
  { value: 12, text: 'Desember' }
]

const mitraOptions = [
  { value: '1', text: 'Bank X Nusantara' },
  { value: '2', text: 'Bank Y Nasional' },
  { value: '3', text: 'Bank Z Internasional' },
  { value: '4', text: 'Bank A Syariah' },
  { value: '5', text: 'Bank B Indonesia' }
]

// Mock data kuota bulanan
const kuotaBulananData = ref([
  {
    id: 1,
    tahun: 2024,
    bulan: 1,
    mitraId: '1',
    kuotaBulanan: 20000000000,
    kuotaTerpakai: 5000000000,
    sisaKuota: 15000000000,
    utilisasi: 25.00,
    status: 'Approved',
    history: [
      { tanggal: '2024-01-01 10:00:00', aktivitas: 'Pengajuan Kuota', user: 'Admin', status: 'Pending' },
      { tanggal: '2024-01-01 10:10:00', aktivitas: 'Approval', user: 'Ajie Budiman', status: 'Approved' }
    ]
  },
  {
    id: 2,
    tahun: 2024,
    bulan: 1,
    mitraId: '2',
    kuotaBulanan: 15000000000,
    kuotaTerpakai: 3000000000,
    sisaKuota: 12000000000,
    utilisasi: 20.00,
    status: 'Approved',
    history: [
      { tanggal: '2024-01-02 09:00:00', aktivitas: 'Pengajuan Kuota', user: 'Admin', status: 'Pending' },
      { tanggal: '2024-01-02 09:10:00', aktivitas: 'Approval', user: 'Ajie Budiman', status: 'Approved' }
    ]
  },
  {
    id: 3,
    tahun: 2024,
    bulan: 2,
    mitraId: '1',
    kuotaBulanan: 25000000000,
    kuotaTerpakai: 8000000000,
    sisaKuota: 17000000000,
    utilisasi: 32.00,
    status: 'Pending Approval',
    history: [
      { tanggal: '2024-02-01 08:00:00', aktivitas: 'Pengajuan Kuota', user: 'Admin', status: 'Pending' }
    ]
  },
  {
    id: 4,
    tahun: 2024,
    bulan: 2,
    mitraId: '3',
    kuotaBulanan: 18000000000,
    kuotaTerpakai: 0,
    sisaKuota: 18000000000,
    utilisasi: 0.00,
    status: 'In Review',
    history: [
      { tanggal: '2024-02-03 07:00:00', aktivitas: 'Pengajuan Kuota', user: 'Admin', status: 'Pending' },
      { tanggal: '2024-02-03 07:05:00', aktivitas: 'Review', user: 'Fajar Ibu Sina', status: 'In Review' }
    ]
  }
])

// Computed properties
const totalKuotaTahunan = computed(() => {
  return 800000000000 // Contoh: 800 Miliar untuk tahun 2024
})

const filteredItems = computed(() => {
  let filtered = [...kuotaBulananData.value]
  
  if (filterTahun.value) {
    filtered = filtered.filter(item => item.tahun === filterTahun.value)
  }
  
  if (filterBulan.value) {
    filtered = filtered.filter(item => item.bulan === filterBulan.value)
  }
  
  if (filterMitra.value) {
    filtered = filtered.filter(item => item.mitraId === filterMitra.value)
  }
  
  return filtered
})

const totalItems = computed(() => filteredItems.value.length)
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
  return filteredItems.value.slice(start, end)
})

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Tambah Kuota Bulanan' : 'Edit Kuota Bulanan'
})

// Watch untuk auto calculate utilisasi
watch(() => [editedItem.value.kuotaBulanan, editedItem.value.kuotaTerpakai], () => {
  if (editedItem.value.kuotaBulanan > 0) {
    editedItem.value.utilisasi = parseFloat(((editedItem.value.kuotaTerpakai || 0) / editedItem.value.kuotaBulanan * 100).toFixed(2))
    editedItem.value.sisaKuota = editedItem.value.kuotaBulanan - (editedItem.value.kuotaTerpakai || 0)
  } else {
    editedItem.value.utilisasi = 0
    editedItem.value.sisaKuota = 0
  }
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

function formatBulan(bulan: number): string {
  const bulanMap: any = {
    1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06',
    7: '07', 8: '08', 9: '09', 10: '10', 11: '11', 12: '12'
  }
  return bulanMap[bulan] || bulan.toString().padStart(2, '0')
}

function getMitraName(mitraId: string): string {
  const mitra = mitraOptions.find(m => m.value === mitraId)
  return mitra ? mitra.text : 'Unknown'
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'success'
    case 'in review':
      return 'warning'
    case 'pending approval':
    case 'pending':
      return 'info'
    case 'revisi':
      return 'orange'
    case 'rejected':
    case 'ditolak':
      return 'error'
    default:
      return 'default'
  }
}

function openAddDialog() {
  editedIndex.value = -1
  editedItem.value = { ...defaultItem }
  dataDialog.value = true
}

function editItem(item: any) {
  editedIndex.value = kuotaBulananData.value.indexOf(item)
  editedItem.value = { ...item }
  dataDialog.value = true
}

function closeDialog() {
  dataDialog.value = false
  setTimeout(() => {
    editedItem.value = { ...defaultItem }
    editedIndex.value = -1
  }, 300)
}

function saveData() {
  if (formValid.value) {
    // Hitung nilai otomatis
    const kuotaBulanan = parseFloat(editedItem.value.kuotaBulanan.toString()) || 0
    const kuotaTerpakai = parseFloat(editedItem.value.kuotaTerpakai.toString()) || 0
    
    editedItem.value.utilisasi = kuotaBulanan > 0 ? parseFloat(((kuotaTerpakai / kuotaBulanan) * 100).toFixed(2)) : 0
    editedItem.value.sisaKuota = kuotaBulanan - kuotaTerpakai
    
    if (editedIndex.value > -1) {
      // Update existing item
      Object.assign(kuotaBulananData.value[editedIndex.value], editedItem.value)
    } else {
      // Add new item
      const newItem = {
        ...editedItem.value,
        id: Math.max(...kuotaBulananData.value.map(item => item.id), 0) + 1,
        history: [
          {
            tanggal: new Date().toISOString(),
            aktivitas: 'Pengajuan Kuota',
            user: 'Admin',
            status: 'Pending'
          }
        ]
      }
      kuotaBulananData.value.push(newItem)
    }
    closeDialog()
  }
}

function openDeleteDialog(item: any, index: number) {
  itemToDelete.value = item
  itemToDeleteIndex.value = index
  deleteDialog.value = true
}

function closeDeleteDialog() {
  deleteDialog.value = false
  itemToDelete.value = null
  itemToDeleteIndex.value = -1
}

function confirmDelete() {
  if (itemToDelete.value && itemToDeleteIndex.value > -1) {
    kuotaBulananData.value.splice(itemToDeleteIndex.value, 1)
  }
  closeDeleteDialog()
}

function viewHistory(item: any) {
  selectedItem.value = item
  historyDialog.value = true
}

function closeHistory() {
  historyDialog.value = false
  selectedItem.value = null
}

function resetFilters() {
  filterTahun.value = null
  filterBulan.value = null
  filterMitra.value = null
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

/* Responsive grid */
.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>           
