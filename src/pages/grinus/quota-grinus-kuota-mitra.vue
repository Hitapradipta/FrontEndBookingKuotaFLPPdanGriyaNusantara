Saya lihat kamu sudah memiliki kode untuk "Kuota Mitra FLPP". Sekarang kamu ingin membuat yang serupa untuk "Kuota Mitra Griya Nusantara". Berikut adalah kode yang sudah dimodifikasi:

```vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-black">Kuota Mitra Griya Nusantara</h1>
      <br>
      <VBtn 
        color="primary" 
        @click="openAddDialog"
        prepend-icon="tabler-plus"
      >
        Tambah Data
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
              <VCol cols="12">
                <VTextField
                  v-model="editedItem.tahun"
                  label="Tahun"
                  type="number"
                  :rules="[v => !!v || 'Tahun harus diisi', v => v > 2000 || 'Tahun tidak valid']"
                  required
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedItem.namaMitra"
                  label="Nama Mitra"
                  :rules="[v => !!v || 'Nama Mitra harus diisi']"
                  required
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedItem.kuotaTotal"
                  label="Kuota Total"
                  type="number"
                  :rules="[v => !!v || 'Kuota Total harus diisi', v => v > 0 || 'Kuota harus lebih dari 0']"
                  required
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedItem.kuotaTerpakai"
                  label="Kuota Terpakai"
                  type="number"
                  :rules="[v => v >= 0 || 'Kuota terpakai tidak boleh negatif']"
                ></VTextField>
              </VCol>
                <VCol cols="12" class="mb-6">
                <VSelect
                  v-model="editedItem.status"
                  :items="statusOptions"
                  label="Status"
                  :rules="[v => !!v || 'Status harus dipilih']"
                  required
                  class="w-full"
                  style="min-width: 300px;"
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
          <VBtn color="blue-darken-1" variant="text" @click="saveData">
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
          Apakah Anda yakin ingin menghapus data mitra ini?
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
        <p class="text-sm text-gray-400">
          Kuota Induk Tahun 2025 sampai dengan Senin, 28 Juli 2025 Pukul 09:43:39
        </p>
        <h2 class="text-3xl font-bold">{{ formatCurrency(totalQuotaInduk) }}</h2>
        <p class="text-sm text-gray-400">
          Persentase Utilisasi telah mencapai {{ utilizationPercentage }}%
        </p>
        <a href="#" class="text-primary">Lihat Kuota Mitra ({{ mitraCount }})</a>
      </VCardText>
    </VCard>

    <!-- Konten Utama -->
    <VCard>
      <VTable class="submission-table" id="mitra-table">
        <thead>
          <tr>
            <th class="text-left">
              Tahun
            </th>
            <th class="text-left">
              Nama Mitra
            </th>
            <th class="text-right">
              Kuota
            </th>
            <th class="text-right">
              Kuota Terpakai
            </th>
            <th class="text-right">
              Sisa Kuota Griya Nusantara
            </th>
            <th class="text-right">
              Utilisasi
            </th>
            <th class="text-left">
              Status
            </th>
            <th class="text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mitra, index) in displayedMitra" :key="index">
            <td>{{ mitra.tahun }}</td>
            <td>{{ mitra.namaMitra }}</td>
            <td class="text-right">{{ formatCurrency(mitra.kuotaTotal) }}</td>
            <td class="text-right">{{ formatCurrency(mitra.kuotaTerpakai || 0) }}</td>
            <td class="text-right">{{ formatCurrency(mitra.sisaKuota || (mitra.kuotaTotal - (mitra.kuotaTerpakai || 0))) }}</td>
            <td class="text-right">{{ mitra.utilisasi || 0 }}%</td>
            <td>
              <VChip
                :color="getStatusColor(mitra.status)"
                size="small"
                variant="flat"
              >
                {{ mitra.status }}
              </VChip>
            </td>
            <td class="text-center">
              <VBtn
                color="warning"
                icon="tabler-edit"
                size="small"
                @click="editItem(mitra)"
                class="mr-1"
              ></VBtn>
              <VBtn
                color="error"
                icon="tabler-trash"
                size="small"
                @click="openDeleteDialog(mitra, index)"
                class="mr-1"
              ></VBtn>
              <VBtn
                color="primary"
                size="small"
                @click="viewMCAHistory(mitra)"
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

    <!-- Dialog MCA History -->
    <VDialog v-model="mcaHistoryDialog" max-width="800px">
      <VCard>
        <VCardTitle>
          <span class="text-h5">History MCA - {{ selectedMitra?.namaMitra }}</span>
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
              <tr v-for="(history, index) in selectedMitra?.mcaHistory || []" :key="index">
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
              <tr v-if="!(selectedMitra?.mcaHistory && selectedMitra.mcaHistory.length)">
                <td colspan="4" class="text-center">
                  Tidak ada history MCA
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeMCAHistory">
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
  VRow,
  VSelect,
  VSpacer,
  VTable,
  VTextField
} from 'vuetify/lib/components/index.mjs'

// Mock data - nanti akan diambil dari store atau API
const mitraData = ref([
  {
    id: 1,
    tahun: 2024,
    namaMitra: 'Bank Griya Sejahtera',
    kuotaTotal: 150000000000,
    kuotaTerpakai: 45000000000,
    sisaKuota: 105000000000,
    utilisasi: 30.00,
    status: 'Approved',
    mcaHistory: [
      { tanggal: '2024-01-15 10:00:00', aktivitas: 'Pengajuan Kuota', user: 'Bank Griya Sejahtera', status: 'Pending' },
      { tanggal: '2024-01-15 10:05:00', aktivitas: 'Review oleh Admin', user: 'Admin Griya', status: 'In Review' },
      { tanggal: '2024-01-15 10:10:00', aktivitas: 'Approval', user: 'Approver Griya', status: 'Approved' }
    ]
  },
  {
    id: 2,
    tahun: 2024,
    namaMitra: 'Bank Rumah Indonesia',
    kuotaTotal: 75000000000,
    kuotaTerpakai: 15000000000,
    sisaKuota: 60000000000,
    utilisasi: 20.00,
    status: 'In Review',
    mcaHistory: [
      { tanggal: '2024-01-14 09:00:00', aktivitas: 'Pengajuan Kuota', user: 'Bank Rumah Indonesia', status: 'Pending' },
      { tanggal: '2024-01-14 09:05:00', aktivitas: 'Review oleh Admin', user: 'Admin Griya', status: 'In Review' }
    ]
  },
  {
    id: 3,
    tahun: 2024,
    namaMitra: 'Bank Perumahan Nasional',
    kuotaTotal: 100000000000,
    kuotaTerpakai: 20000000000,
    sisaKuota: 80000000000,
    utilisasi: 20.00,
    status: 'Pending Approval',
    mcaHistory: [
      { tanggal: '2024-01-13 08:00:00', aktivitas: 'Pengajuan Kuota', user: 'Bank Perumahan Nasional', status: 'Pending' }
    ]
  },
  {
    id: 4,
    tahun: 2024,
    namaMitra: 'Bank Syariah Perumahan',
    kuotaTotal: 80000000000,
    kuotaTerpakai: 16000000000,
    sisaKuota: 64000000000,
    utilisasi: 20.00,
    status: 'Revisi',
    mcaHistory: [
      { tanggal: '2024-01-12 07:00:00', aktivitas: 'Pengajuan Kuota', user: 'Bank Syariah Perumahan', status: 'Pending' },
      { tanggal: '2024-01-12 07:05:00', aktivitas: 'Review oleh Admin', user: 'Admin Griya', status: 'In Review' },
      { tanggal: '2024-01-12 07:10:00', aktivitas: 'Memerlukan Revisi', user: 'Approver Griya', status: 'Revisi' }
    ]
  }
])

// Data kuota induk
const totalQuotaInduk = ref(1200000000)
const utilizationPercentage = ref(4.25)
const mitraCount = ref(0)

// State untuk paginasi
const itemsPerPage = ref(20)
const currentPage = ref(1)

// State untuk dialog
const dataDialog = ref(false)
const deleteDialog = ref(false)
const formValid = ref(false)
const form = ref(null)

// State untuk form
const editedIndex = ref(-1)
const editedItem = ref({
  id: 0,
  tahun: new Date().getFullYear(),
  namaMitra: '',
  kuotaTotal: 0,
  kuotaTerpakai: 0,
  sisaKuota: 0,
  utilisasi: 0,
  status: '',
  mcaHistory: []
})

const defaultItem = {
  id: 0,
  tahun: new Date().getFullYear(),
  namaMitra: '',
  kuotaTotal: 0,
  kuotaTerpakai: 0,
  sisaKuota: 0,
  utilisasi: 0,
  status: '',
  mcaHistory: []
}

// State untuk delete
const itemToDelete = ref<any>(null)
const itemToDeleteIndex = ref(-1)

// State untuk dialog MCA History
const mcaHistoryDialog = ref(false)
const selectedMitra = ref<any>(null)

// Options
const statusOptions = [
  'Approved',
  'In Review',
  'Pending Approval',
  'Revisi',
  'Rejected'
]

// Computed properties untuk paginasi
const totalItems = computed(() => mitraData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const firstItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const lastItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
})

const displayedMitra = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return mitraData.value.slice(start, end)
})

// Computed untuk form title
const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Tambah Data Mitra Griya Nusantara' : 'Edit Data Mitra Griya Nusantara'
})

// Watch untuk auto calculate utilisasi
watch(() => [editedItem.value.kuotaTotal, editedItem.value.kuotaTerpakai], () => {
  if (editedItem.value.kuotaTotal > 0) {
    editedItem.value.utilisasi = parseFloat(((editedItem.value.kuotaTerpakai || 0) / editedItem.value.kuotaTotal * 100).toFixed(2));
    editedItem.value.sisaKuota = editedItem.value.kuotaTotal - (editedItem.value.kuotaTerpakai || 0);
  } else {
    editedItem.value.utilisasi = 0;
    editedItem.value.sisaKuota = 0;
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
  editedIndex.value = mitraData.value.indexOf(item)
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

function generateInitialMCAHistory(mitraName: string, status: string): any[] {
  const now = new Date();
  const history = [
    {
      tanggal: now.toISOString(),
      aktivitas: 'Pengajuan Kuota',
      user: mitraName,
      status: 'Pending'
    }
  ];

  // Tambahkan entry tambahan berdasarkan status
  if (status === 'In Review' || status === 'Approved' || status === 'Revisi' || status === 'Rejected') {
    const reviewTime = new Date(now.getTime() + 5 * 60000); // 5 menit kemudian
    history.push({
      tanggal: reviewTime.toISOString(),
      aktivitas: 'Review oleh Admin',
      user: 'Admin Griya',
      status: 'In Review'
    });
  }

  if (status === 'Approved') {
    const approveTime = new Date(now.getTime() + 10 * 60000); // 10 menit kemudian
    history.push({
      tanggal: approveTime.toISOString(),
      aktivitas: 'Approval',
      user: 'Approver Griya',
      status: 'Approved'
    });
  } else if (status === 'Revisi') {
    const revisiTime = new Date(now.getTime() + 10 * 60000); // 10 menit kemudian
    history.push({
      tanggal: revisiTime.toISOString(),
      aktivitas: 'Memerlukan Revisi',
      user: 'Approver Griya',
      status: 'Revisi'
    });
  } else if (status === 'Rejected') {
    const rejectTime = new Date(now.getTime() + 10 * 60000); // 10 menit kemudian
    history.push({
      tanggal: rejectTime.toISOString(),
      aktivitas: 'Ditolak',
      user: 'Approver Griya',
      status: 'Rejected'
    });
  }

  return history;
}

function saveData() {
  if (formValid.value) {
    // Hitung nilai otomatis
    const kuotaTotal = parseFloat(editedItem.value.kuotaTotal.toString()) || 0;
    const kuotaTerpakai = parseFloat(editedItem.value.kuotaTerpakai.toString()) || 0;
    
    // Hitung utilisasi dan sisa kuota
    editedItem.value.utilisasi = kuotaTotal > 0 ? parseFloat(((kuotaTerpakai / kuotaTotal) * 100).toFixed(2)) : 0;
    editedItem.value.sisaKuota = kuotaTotal - kuotaTerpakai;
    
    if (editedIndex.value > -1) {
      // Update existing item
      // Generate MCA history jika status berubah
      if (editedItem.value.status !== mitraData.value[editedIndex.value].status) {
        const newHistory = generateInitialMCAHistory(
          editedItem.value.namaMitra, 
          editedItem.value.status
        );
        editedItem.value.mcaHistory = newHistory;
      }
      Object.assign(mitraData.value[editedIndex.value], editedItem.value);
    } else {
      // Add new item
      const newItem = {
        ...editedItem.value,
        id: Math.max(...mitraData.value.map(item => item.id), 0) + 1,
        mcaHistory: generateInitialMCAHistory(editedItem.value.namaMitra, editedItem.value.status)
      };
      mitraData.value.push(newItem);
    }
    closeDialog();
  }
}

function openDeleteDialog(item: any, index: number) {
  itemToDelete.value = item;
  itemToDeleteIndex.value = index;
  deleteDialog.value = true;
}

function closeDeleteDialog() {
  deleteDialog.value = false;
  itemToDelete.value = null;
  itemToDeleteIndex.value = -1;
}

function confirmDelete() {
  if (itemToDelete.value && itemToDeleteIndex.value > -1) {
    mitraData.value.splice(itemToDeleteIndex.value, 1);
  }
  closeDeleteDialog();
}

function viewMCAHistory(mitra: any) {
  selectedMitra.value = mitra;
  mcaHistoryDialog.value = true;
}

function closeMCAHistory() {
  mcaHistoryDialog.value = false;
  selectedMitra.value = null;
}

function printTable() {
  const printContent = document.getElementById('mitra-table');
  if (printContent) {
    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Kuota Mitra Griya Nusantara</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
            </style>
          </head>
          <body>
            <h2>Kuota Mitra Griya Nusantara</h2>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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

.v-select {
  width: 80px;
}

.v-pagination {
  justify-content: center !important;
}

/* Stylings tambahan */
.VProgressCircular {
  margin: auto;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
```
