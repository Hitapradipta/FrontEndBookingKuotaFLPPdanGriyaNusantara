```vue
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-black">Jadwal Angsuran FLPP</h1>
      <div class="flex items-center space-x-4">
        
        <!-- Tombol Tambah Data -->
        <VBtn 
          color="primary" 
          @click="openAddDialog"
          prepend-icon="tabler-plus"
        >
          Tambah Data
        </VBtn>
      </div>
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
                  v-model="editedItem.namaMitra"
                  label="Nama Mitra"
                  :rules="[v => !!v || 'Nama Mitra harus diisi']"
                  required
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedItem.batch"
                  label="Batch"
                  :rules="[v => !!v || 'Batch harus diisi']"
                  required
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="editedItem.status"
                  :items="statusOptions"
                  label="Status"
                  :rules="[v => !!v || 'Status harus diisi']"
                  required
                ></VSelect>
              </VCol>
              <VCol cols="12">
                <div class="mb-2">
                  <label class="text-sm font-medium text-gray-700">
                    Upload File Angsuran <span class="text-error">*</span>
                  </label>
                </div>
                <div 
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                  @click="openFileDialog"
                  @dragover.prevent
                  @drop="handleFileDrop"
                >
                  <VIcon icon="tabler-upload" size="24" class="mb-2" />
                  <p class="text-sm text-gray-600">
                    <span class="text-primary">Klik untuk upload</span> atau drag file ke sini
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Format: PDF (Max 10MB)</p>
                  <input
                    type="file"
                    ref="fileInput"
                    style="display: none"
                    accept=".pdf"
                    @change="handleFileUpload"
                  />
                </div>
                <!-- Display uploaded file name -->
                <div v-if="editedItem.fileName" class="mt-2">
                  <VChip
                    color="success"
                    size="small"
                    variant="flat"
                  >
                    <VIcon start icon="tabler-file-check" />
                    {{ editedItem.fileName }}
                    <VIcon 
                      end 
                      icon="tabler-x" 
                      @click="removeFile"
                      class="cursor-pointer"
                    />
                  </VChip>
                </div>
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
          Apakah Anda yakin ingin menghapus data ini?
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

    <!-- Tabel Jadwal Angsuran -->
    <VCard>
      <VTable class="submission-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Mitra</th>
            <th>Batch</th>
            <th>File Angsuran</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedItems" :key="index">
            <td>{{ item.id }}</td>
            <td>{{ item.namaMitra }}</td>
            <td>{{ item.batch }}</td>
            <td>
              <a :href="item.fileUrl" target="_blank" class="text-primary">
                <VIcon icon="tabler-file-pdf" size="18" class="mr-2" />
                {{ item.fileName }}
              </a>
            </td>
            <td>
              <VChip
                :color="getStatusColor(item.status)"
                size="small"
              >
                {{ item.status }}
              </VChip>
            </td>
            <td>
              <div class="d-flex">
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
                ></VBtn>
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
import { computed, ref } from 'vue'
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
  VIcon,
  VPagination,
  VRow,
  VSelect,
  VSpacer,
  VTable,
  VTextField
} from 'vuetify/lib/components/index.mjs'

// Mock data - nanti akan diambil dari store atau API
const submittedData = ref([
  {
    id: 1,
    namaMitra: 'Bank 123 Aja',
    batch: 'Batch 1',
    fileUrl: '/file/manual.pdf',
    fileName: 'manual.pdf',
    status: 'Approved'
  },
  {
    id: 2,
    namaMitra: 'Bank XYZ Indonesia',
    batch: 'Batch 2',
    fileUrl: '/file/jadwal_angsuran_q1.pdf',
    fileName: 'jadwal_angsuran_q1.pdf',
    status: 'In Review'
  },
  {
    id: 3,
    namaMitra: 'Bank ABC Nasional',
    batch: 'Batch 3',
    fileUrl: '/file/angsuran_bulanan.pdf',
    fileName: 'angsuran_bulanan.pdf',
    status: 'Rejected'
  },
])

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
  namaMitra: '',
  batch: '',
  fileUrl: '',
  fileName: '',
  status: ''
})

const defaultItem = {
  id: 0,
  namaMitra: '',
  batch: '',
  fileUrl: '',
  fileName: '',
  status: ''
}

// State untuk delete
const itemToDelete = ref<any>(null)
const itemToDeleteIndex = ref(-1)

// Options untuk status
const statusOptions = [
  { title: 'Approved', value: 'Approved' },
  { title: 'In Review', value: 'In Review' },
  { title: 'Rejected', value: 'Rejected' }
]

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

// Computed untuk form title
const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Tambah Data Jadwal Angsuran' : 'Edit Data Jadwal Angsuran'
})

// Refs
const fileInput = ref<HTMLInputElement | null>(null)

// Methods
function getStatusColor(status: string) {
  switch (status) {
    case 'Approved':
      return 'success'
    case 'In Review':
      return 'warning'
    case 'Rejected':
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
  editedIndex.value = submittedData.value.indexOf(item)
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
    if (editedIndex.value > -1) {
      // Update existing item
      Object.assign(submittedData.value[editedIndex.value], editedItem.value)
    } else {
      // Add new item
      const newItem = {
        ...editedItem.value,
        id: Math.max(...submittedData.value.map(item => item.id), 0) + 1
      }
      submittedData.value.push(newItem)
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
    submittedData.value.splice(itemToDeleteIndex.value, 1)
  }
  closeDeleteDialog()
}

function openFileDialog() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function handleFileUpload(event: any) {
  const file = event.target.files[0]
  if (file) {
    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB!')
      event.target.value = ''
      return
    }
    
    // Validasi tipe file
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Hanya file PDF yang diizinkan!')
      event.target.value = ''
      return
    }
    
    // Simpan informasi file
    editedItem.value.fileName = file.name
    editedItem.value.fileUrl = URL.createObjectURL(file)
    console.log('File terpilih:', file.name)
  }
}

function handleFileDrop(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file) {
      // Validasi ukuran file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal 10MB!')
        return
      }
      
      // Validasi tipe file
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Hanya file PDF yang diizinkan!')
        return
      }
      
      // Simpan informasi file
      editedItem.value.fileName = file.name
      editedItem.value.fileUrl = URL.createObjectURL(file)
      console.log('File terdrop:', file.name)
    }
  }
}

function removeFile() {
  editedItem.value.fileName = ''
  editedItem.value.fileUrl = ''
  if (fileInput.value) {
    fileInput.value.value = ''
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
</style>
```
