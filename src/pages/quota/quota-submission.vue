<template>
  <div class="container mx-auto p-4">
    <VCard class="rounded-lg">
      <VCardItem>
        <VCardTitle class="text-2xl font-bold">
          Permohonan Pengajuan Kuota FLPP
        </VCardTitle>
      </VCardItem>
      
      <VCardText>
        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <!-- Nama Mitra -->
          <div class="mb-4">
            <label for="nama-mitra" class="block text-sm font-medium text-gray-700 mb-2">
              Nama Mitra <span class="text-error">*</span>
            </label>
            <VSelect
              id="nama-mitra"
              v-model="formData.namaMitra"
              :items="mitraOptions"
              item-title="text"
              item-value="value"
              variant="outlined"
              density="comfortable"
              placeholder="Pilih Mitra"
              required
              hide-details
            />
          </div>

          <!-- Tanggal Permohonan -->
          <div class="mb-4">
            <label for="tanggal-permohonan" class="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Permohonan <span class="text-error">*</span>
            </label>
            <VTextField
              id="tanggal-permohonan"
              v-model="formData.tanggalPermohonan"
              type="date"
              variant="outlined"
              density="comfortable"
              hide-details
              required
            />
          </div>

          <!-- Input Nominal -->
          <div class="mb-4">
            <label for="input-nominal" class="block text-sm font-medium text-gray-700 mb-2">
              Input Nominal <span class="text-error">*</span>
            </label>
            <VTextField
              id="input-nominal"
              v-model="formattedInputNominal"
              placeholder="Rp 0"
              variant="outlined"
              density="comfortable"
              hide-details
              required
              @keydown="allowOnlyNumbers"
              @blur="formatInputNominal"
            />
          </div>

          <!-- Nominal Porsi 100% -->
          <div class="mb-4">
            <label for="nominal-porsi-100" class="block text-sm font-medium text-gray-700 mb-2">
              Nominal Porsi 100% <span class="text-error">*</span>
            </label>
            <VTextField
              id="nominal-porsi-100"
              v-model="formattedNominalPorsi100"
              placeholder="Rp 0"
              variant="outlined"
              density="comfortable"
              hide-details
              required
              readonly
            />
          </div>

          <!-- Nominal Porsi 25% -->
          <div class="mb-4">
            <label for="nominal-porsi-25" class="block text-sm font-medium text-gray-700 mb-2">
              Nominal Porsi 25% <span class="text-error">*</span>
            </label>
            <VTextField
              id="nominal-porsi-25"
              v-model="formattedNominalPorsi25"
              placeholder="Rp 0"
              variant="outlined"
              density="comfortable"
              hide-details
              required
              readonly
            />
          </div>

          <!-- Upload Surat Notifikasi -->
          <div class="mb-6">
            <label for="upload-file" class="block text-sm font-medium text-gray-700 mb-2">
              Upload Surat Notifikasi <span class="text-error">*</span>
            </label>
            <div class="justify-center items-center border-2 border-dashed border-gray-300 rounded-lg ">
              <div class="flex flex-col items-center justify-center text-center pa-4">
                <VBtn
                  variant="outlined"
                  color="primary"
                  @click="openFileDialog"
                  class="mb-2"
                > 
                  Add Files
                </VBtn>
                <p class="text-xs text-gray-700">Drag Files Here</p>
              </div>
            </div>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              accept=".pdf,.jpg,.jpeg,.png"
              @change="handleFileUpload"
            />
            <!-- Display uploaded file name -->
            <div v-if="formData.uploadedFile" class="mt-2">
              <VChip
                color="success"
                size="small"
                variant="flat"
              >
                <VIcon start icon="tabler-file-check" />
                {{ formData.uploadedFile.name }}
              </VChip>
            </div>
            <p class="mt-1 text-xs text-gray-500">Format: PDF, JPG, PNG (Max 10MB)</p>
          </div>  

          <!-- Tombol Submit -->
          <div class="d-flex justify-end">
            <VBtn
              color="success"
              type="submit"
            >
              Ajukan
            </VBtn>
            <VBtn
              color="secondary"
              variant="outlined"
              @click="resetForm"
              class="ml-2"
            >
              Ulangi
            </VBtn>
            <VBtn
              color="error"
              variant="outlined"
              @click="goBack"
              class="ml-2"
            >
              Kembali Ke Menu
            </VBtn>
          </div>
        </form>
      </VCardText>
    </VCard>
  </div>
</template>

<script>
import { VBtn, VCard, VCardItem, VCardText, VCardTitle, VChip, VIcon, VSelect, VTextField } from 'vuetify/lib/components/index.mjs';

export default {
  components: {
    VCard,
    VCardItem,
    VCardTitle,
    VCardText,
    VSelect,
    VTextField,
    VBtn,
    VChip,
    VIcon,
  },
  data() {
    return {
      mitraOptions: [
        { text: 'Pilih Mitra', value: '', disabled: true },
        { text: 'Bank X Indonesia', value: 'bank-x-indonesia' },
        { text: 'Bank Y Nasional', value: 'bank-y-nasional' },
        { text: 'Bank Z Internasional', value: 'bank-z-internasional' },
      ],
      formData: {
        namaMitra: '',
        tanggalPermohonan: '',
        inputNominal: null,
        nominalPorsi100: null,
        nominalPorsi25: null,
        uploadedFile: null,
      },
    };
  },
  computed: {
    formattedInputNominal: {
      get() {
        return this.formatCurrency(this.formData.inputNominal);
      },
      set(value) {
        this.formData.inputNominal = this.parseCurrency(value);
      }
    },
    formattedNominalPorsi100: {
      get() {
        return this.formatCurrency(this.formData.nominalPorsi100);
      }
    },
    formattedNominalPorsi25: {
      get() {
        return this.formatCurrency(this.formData.nominalPorsi25);
      }
    }
  },
  methods: {
    allowOnlyNumbers(event) {
      // Allow: backspace, delete, tab, escape, enter, decimal point, and numbers
      const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
      ];
      
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
        return;
      }
      
      // Allow numbers and decimal point
      if (allowedKeys.includes(event.key) || 
          (event.key >= '0' && event.key <= '9') || 
          event.key === '.') {
        return;
      }
      
      // Prevent default for all other keys
      event.preventDefault();
    },
    formatCurrency(amount) {
      if (amount === null || amount === undefined || amount === '') return 'Rp 0';
      // Remove any non-digit characters except decimal point
      const num = parseFloat(amount);
      if (isNaN(num)) return 'Rp 0';
      
      // Format with thousand separators
      return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    parseCurrency(value) {
      if (!value) return null;
      // Remove 'Rp ' and dots, then convert to number
      const cleanValue = value.replace('Rp ', '').replace(/\./g, '');
      return cleanValue ? parseFloat(cleanValue) : null;
    },
    formatInputNominal() {
      if (this.formData.inputNominal !== null) {
        this.formData.inputNominal = parseFloat(this.formData.inputNominal);
      }
    },
    calculatePercentages() {
      if (this.formData.inputNominal) {
        const nominal = parseFloat(this.formData.inputNominal);
        this.formData.nominalPorsi100 = nominal;
        this.formData.nominalPorsi25 = nominal * 0.25;
      } else {
        this.formData.nominalPorsi100 = null;
        this.formData.nominalPorsi25 = null;
      }
    },
    handleSubmit() {
      // Validasi form (opsional)
      if (!this.formData.namaMitra || !this.formData.tanggalPermohonan || !this.formData.inputNominal) {
        this.$toast?.error('Mohon isi semua field yang wajib!') || alert('Mohon isi semua field yang wajib!');
        return;
      }

      // Validasi file upload
      if (!this.formData.uploadedFile) {
        this.$toast?.error('Mohon upload surat notifikasi!') || alert('Mohon upload surat notifikasi!');
        return;
      }

      // Simpan data atau kirim ke server
      console.log('Data pengajuan:', this.formData);

      // Tampilkan notifikasi sukses
      this.$toast?.success('Pengajuan berhasil dikirim!') || alert('Pengajuan berhasil dikirim!');

      // Reset form setelah submit
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        namaMitra: '',
        tanggalPermohonan: '',
        inputNominal: null,
        nominalPorsi100: null,
        nominalPorsi25: null,
        uploadedFile: null,
      };
    },
    goBack() {
      // Kembali ke halaman utama (index.vue)
      this.$router.push('/');
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Validasi ukuran file (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          this.$toast?.error('Ukuran file maksimal 10MB!') || alert('Ukuran file maksimal 10MB!');
          event.target.value = '';
          return;
        }
        this.formData.uploadedFile = file;
        console.log('File terpilih:', file.name);
      }
    },
    openFileDialog() {
      this.$refs.fileInput.click();
    },
  },
  watch: {
    'formData.inputNominal': {
      handler() {
        this.calculatePercentages();
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
/* Custom styles jika diperlukan */
</style>
