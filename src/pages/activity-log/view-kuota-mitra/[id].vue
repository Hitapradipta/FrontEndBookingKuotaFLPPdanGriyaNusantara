<template>
  <div class="container mx-auto p-4">
    <!-- Header Informasi Kuota Induk -->
    <VCard class="mb-4" :loading="loading">
      <VCardTitle class="text-h6 font-weight-bold">
        <VBtn 
          color="primary" 
          variant="text" 
          @click="goBack"
          prepend-icon="tabler-arrow-left"
        >
          Balik ke tabel utama [Kuota {{ currentYear }}]
        </VBtn>
      </VCardTitle>
      <VCardText>
        <VTable class="rounded-lg" density="comfortable">
          <thead>
            <tr>
              <th class="text-left bg-blue-600 text-white font-semibold">Kuota Induk Tahun</th>
              <th class="text-right bg-blue-600 text-white font-semibold">Total Kuota</th>
              <th class="text-right bg-blue-600 text-white font-semibold">Kuota Belum Terlokasi</th>
              <th class="text-right bg-blue-600 text-white font-semibold">Sisa Kuota</th>
              <th class="text-right bg-blue-600 text-white font-semibold">Persentase Utilisasi</th>
              <th class="text-center bg-blue-600 text-white font-semibold">Activated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="py-6 text-center text-gray-500">Memuat data kuota induk...</td>
            </tr>
            <tr v-else>
              <td class="text-center font-medium">{{ currentYear }}</td>
              <td class="text-right font-medium text-blue-600">{{ formatCurrency(kuotaInduk.totalKuota) }}</td>
              <td class="text-right font-medium text-orange-600">{{ formatCurrency(kuotaInduk.kuotaBelumTerlokasi) }}</td>
              <td class="text-right font-medium text-green-600">{{ formatCurrency(kuotaInduk.sisaKuota) }}</td>
              <td class="text-right font-medium text-purple-600">{{ kuotaInduk.utilisasi }}%</td>
              <td class="text-center">
                <VCheckbox v-model="activated" disabled />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>

    <!-- Modal Form Tambah/Edit -->
    <VDialog v-model="dialog" max-width="600px" persistent>
      <VCard>
        <VCardTitle>
          <span class="text-h5">{{ formTitle }}</span>
        </VCardTitle>
        <VCardText>
          <VForm ref="form" v-model="valid">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="editedItem.tahun"
                  label="Tahun"
                  :rules="[v => !!v || 'Tahun harus diisi']"
                  required
                  type="number"
                  disabled
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
                  v-model.number="editedItem.kuota"
                  label="Kuota"
                  :rules="[
                    v => !!v || 'Kuota harus diisi', 
                    v => v > 0 || 'Kuota harus lebih dari 0',
                    v => v <= maxKuotaAllowed || `Kuota melebihi kuota yang tersedia (${formatCurrency(maxKuotaAllowed)})`
                  ]"
                  required
                  type="number"
                  prefix="Rp"
                  @input="calculateUtilization"
                  @focus="showMaxKuota = true"
                  @blur="showMaxKuota = false"
                ></VTextField>
                <div v-if="showMaxKuota" class="text-xs text-gray-500 mt-1">
                  Maksimum: {{ formatCurrency(maxKuotaAllowed) }}
                </div>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model.number="editedItem.kuotaTerpakai"
                  label="Kuota Terpakai"
                  :rules="[v => v >= 0 || 'Kuota terpakai tidak boleh negatif']"
                  type="number"
                  prefix="Rp"
                  @input="calculateUtilization"
                ></VTextField>
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="editedItem.utilisasi"
                  label="Persentase Utilisasi (%)"
                  readonly
                  suffix="%"
                ></VTextField>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="close">
            Batal
          </VBtn>
          <VBtn color="success" variant="text" @click="save" :disabled="!valid">
            Simpan
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Modal Konfirmasi Hapus -->
    <VDialog v-model="deleteDialog" max-width="450px">
      <VCard>
        <VCardTitle class="text-h5">Konfirmasi Hapus</VCardTitle>
        <VCardText>Apakah Anda yakin ingin menghapus data ini?</VCardText>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="blue-darken-1" variant="text" @click="closeDeleteDialog">Batal</VBtn>
          <VBtn color="error" variant="text" @click="confirmDelete">Hapus</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Tombol Aksi -->
    <div class="flex justify-between items-center mb-4 bg-blue-600 text-white p-3 rounded-lg shadow-md">
      <div>
        <VBtn color="white" class="mr-2" @click="openNewForm">
          <VIcon start>tabler-plus</VIcon>
          Tambah baru
        </VBtn>
      </div>
      <div class="flex items-center">
      </div>
    </div>

    <!-- Tabel Data Mitra -->
    <VCard class="shadow-md">
      <VTable class="submission-table">
        <thead>
          <tr class="bg-gray-800 text-white">
            <th class="text-left p-4">TAHUN</th>
            <th class="text-left p-4">NAMA MITRA</th>
            <th class="text-right p-4">KUOTA</th>
            <th class="text-right p-4">KUOTA TERPAKAI</th>
            <th class="text-right p-4">SISA KUOTA FLPP</th>
            <th class="text-right p-4">PERSENTASE UTILISASI</th>
            <th class="text-center p-4">AKSI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mitra, index) in displayedMitraData" :key="mitra.id" class="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200">
            <td class="p-4 text-center">{{ mitra.tahun }}</td>
            <td class="p-4 text-center font-medium">{{ mitra.namaMitra }}</td>
            <td class="p-4 text-right font-medium text-blue-600">{{ formatCurrency(mitra.kuota) }}</td>
            <td class="p-4 text-right text-orange-600">{{ formatCurrency(mitra.kuotaTerpakai) }}</td>
            <td class="p-4 text-right text-green-600">{{ formatCurrency(mitra.sisaKuota) }}</td>
            <td class="p-4 text-right text-purple-600">{{ mitra.utilisasi }}%</td>
            <td class="p-4 text-center">
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
                @click="openDeleteDialog(mitra.id)"
              ></VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>

      <!-- Pagination -->
      <div class="d-flex justify-space-between align-center pa-4 bg-gray-50">
        <div class="text-body-2 text-medium-emphasis">
          Menampilkan 
          {{ Math.min((page - 1) * itemsPerPage + 1, mockMitraData.length) }} 
          sampai 
          {{ Math.min(page * itemsPerPage, mockMitraData.length) }} 
          dari {{ mockMitraData.length }} data
        </div>
        <VPagination
          v-model="page"
          :length="totalPages"
          :total-visible="7"
          density="comfortable"
        />
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  VBtn,
  VCard,
  VCardText,
  VCardTitle,
  VCheckbox,
  VCol,
  VDialog,
  VForm,
  VIcon,
  VPagination,
  VRow,
  VSpacer,
  VTable,
  VTextField
} from 'vuetify/lib/components/index.mjs';

// --- Route & Navigation ---
const route = useRoute();
const router = useRouter();
const userId = computed(() => (route.params as Record<string, any>)?.mitraId || (route.query as Record<string, any>)?.userId);

// --- API Configuration ---
const API_BASE = 'http://localhost:8080/api/v1'; // Ganti sesuai backend Golang
const currentYear = new Date().getFullYear();

// --- Types (Opsional, untuk type safety) ---
interface KuotaInduk {
  totalKuota: bigint;
  kuotaBelumTerlokasi: bigint;
  sisaKuota: bigint;
  utilisasi: number;
}

// --- State ---
const loading = ref(true);
const activated = ref(false);
const itemsPerPage = ref(20);
const page = ref(1);
const dialog = ref(false);
const valid = ref(false);
const form = ref(null);
const deleteDialog = ref(false);
const itemToDelete = ref<number | null>(null);
const showMaxKuota = ref(false);

const kuotaInduk = ref<KuotaInduk>({
  totalKuota: 0n,
  kuotaBelumTerlokasi: 0n,
  sisaKuota: 0n,
  utilisasi: 0.00
});

const mockMitraData = ref([
  {
    id: 1,
    tahun: 2024,
    namaMitra: 'Bank X Nusantara',
    kuota: 1000000000n,
    kuotaTerpakai: 37500000n,
    sisaKuota: 962500000n,
    utilisasi: 3.75,
  },
  {
    id: 2,
    tahun: 2024,
    namaMitra: 'Bank Nano',
    kuota: 5000000000n,
    kuotaTerpakai: 750000000n,
    sisaKuota: 4250000000n,
    utilisasi: 15.0,
  },
]);

// --- Computed ---
const totalPages = computed(() => Math.ceil(mockMitraData.value.length / itemsPerPage.value));
const displayedMitraData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return mockMitraData.value.slice(start, end);
});

const maxKuotaAllowed = computed(() => {
  let availableKuota = kuotaInduk.value.kuotaBelumTerlokasi;
  if (editedIndex.value > -1) {
    const existingMitra = mockMitraData.value[editedIndex.value];
    availableKuota += BigInt(existingMitra.kuota);
  }
  return Number(availableKuota);
});

// --- Form Management ---
const defaultItem = {
  id: 0,
  tahun: currentYear,
  namaMitra: '',
  kuota: 0,
  kuotaTerpakai: 0,
  sisaKuota: 0,
  utilisasi: 0,
};

const editedItem = ref({ ...defaultItem });
const editedIndex = ref(-1);
const formTitle = computed(() => (editedIndex.value === -1 ? 'Tambah Mitra Baru' : 'Edit Mitra'));

// --- Methods ---
function formatCurrency(amount: number | bigint): string {
  if (!amount && amount !== 0) return 'Rp 0';
  const num = Number(amount);
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function calculateUtilization() {
  const kuota = BigInt(editedItem.value.kuota || 0);
  const kuotaTerpakai = BigInt(editedItem.value.kuotaTerpakai || 0);

  if (kuota > 0n) {
    const utilisasi = Number((Number(kuotaTerpakai) / Number(kuota)) * 100).toFixed(2);
    editedItem.value.utilisasi = parseFloat(utilisasi);
    editedItem.value.sisaKuota = Number(kuota - kuotaTerpakai);
  } else {
    editedItem.value.utilisasi = 0;
    editedItem.value.sisaKuota = 0;
  }
}

function goBack() {
  router.push({ name: 'quota-kuota' });
}

function openNewForm() {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
  dialog.value = true;
}

function editItem(item: any) {
  editedIndex.value = mockMitraData.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
}

function close() {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = { ...defaultItem };
    editedIndex.value = -1;
  }, 300);
}

async function save() {
  const { valid: formValid } = await form.value?.validate();
  if (!formValid) return;

  const kuota = BigInt(editedItem.value.kuota || 0);
  const kuotaTerpakai = BigInt(editedItem.value.kuotaTerpakai || 0);

  editedItem.value.sisaKuota = Number(kuota - kuotaTerpakai);
  editedItem.value.utilisasi = kuota > 0n
    ? parseFloat(((Number(kuotaTerpakai) / Number(kuota)) * 100).toFixed(2))
    : 0;

  if (editedIndex.value > -1) {
    const oldKuota = BigInt(mockMitraData.value[editedIndex.value].kuota);
    kuotaInduk.value.kuotaBelumTerlokasi = kuotaInduk.value.kuotaBelumTerlokasi + oldKuota - kuota;
    Object.assign(mockMitraData.value[editedIndex.value], editedItem.value);
  } else {
    const newItem = {
      ...editedItem.value,
      id: Math.max(...mockMitraData.value.map(item => item.id), 0) + 1
    };
    kuotaInduk.value.kuotaBelumTerlokasi = kuotaInduk.value.kuotaBelumTerlokasi - kuota;
    mockMitraData.value.push(newItem);
  }

  // Update sisa & utilisasi global
  const totalKuotaTerpakai = mockMitraData.value.reduce((sum, mitra) => sum + BigInt(mitra.kuota), 0n);
  kuotaInduk.value.sisaKuota = kuotaInduk.value.totalKuota - totalKuotaTerpakai;
  kuotaInduk.value.utilisasi = kuotaInduk.value.totalKuota > 0n
    ? parseFloat(((Number(totalKuotaTerpakai) / Number(kuotaInduk.value.totalKuota)) * 100).toFixed(2))
    : 0;

  close();
}

function openDeleteDialog(id: number) {
  itemToDelete.value = id;
  deleteDialog.value = true;
}

function closeDeleteDialog() {
  deleteDialog.value = false;
  itemToDelete.value = null;
}

function confirmDelete() {
  if (itemToDelete.value !== null) {
    const index = mockMitraData.value.findIndex(item => item.id === itemToDelete.value);
    if (index > -1) {
      const deletedItem = mockMitraData.value[index];
      kuotaInduk.value.kuotaBelumTerlokasi = kuotaInduk.value.kuotaBelumTerlokasi + BigInt(deletedItem.kuota);
      mockMitraData.value.splice(index, 1);

      const totalKuotaTerpakai = mockMitraData.value.reduce((sum, mitra) => sum + BigInt(mitra.kuota), 0n);
      kuotaInduk.value.sisaKuota = kuotaInduk.value.totalKuota - totalKuotaTerpakai;
      kuotaInduk.value.utilisasi = kuotaInduk.value.totalKuota > 0n
        ? parseFloat(((Number(totalKuotaTerpakai) / Number(kuotaInduk.value.totalKuota)) * 100).toFixed(2))
        : 0;
    }
  }
  closeDeleteDialog();
}

// --- Fetch Data dari API ---
async function fetchKuotaInduk() {
  loading.value = true;
  try {
    const response = await fetch(`${API_BASE}/kuota-induk?tahun=${currentYear}`);
    if (!response.ok) throw new Error('Gagal memuat data kuota induk');

    const data = await response.json();

    kuotaInduk.value.totalKuota = BigInt(data.totalKuota);
    kuotaInduk.value.kuotaBelumTerlokasi = BigInt(data.kuotaBelumTerlokasi);
    kuotaInduk.value.sisaKuota = BigInt(data.sisaKuota);
    kuotaInduk.value.utilisasi = parseFloat(data.utilisasi.toFixed(2));
    activated.value = data.activated ?? false;
  } catch (error) {
    console.error('Error fetching kuota induk:', error);
    // Fallback data
    kuotaInduk.value.totalKuota = 100000000000n;
    kuotaInduk.value.kuotaBelumTerlokasi = 100000000000n;
    kuotaInduk.value.sisaKuota = 100000000000n;
    kuotaInduk.value.utilisasi = 0.00;
    activated.value = false;
  } finally {
    loading.value = false;
  }
}

// --- Inisialisasi ---
onMounted(() => {
  fetchKuotaInduk();
  console.log('User ID:', userId.value);
});
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
