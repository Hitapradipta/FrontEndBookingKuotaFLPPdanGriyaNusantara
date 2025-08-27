    <template>
    <div class="container mx-auto p-4">
        <VCard class="rounded-lg">
        <VCardItem>
            <VCardTitle class="text-2xl font-bold">
            Detail Pengajuan Kuota FLPP
            </VCardTitle>
        </VCardItem>
        <VCardText>
            <!-- Form View Only -->
            <form>
            <!-- Nama Mitra -->
            <div class="mb-4">
                <label for="nama-mitra" class="block text-sm font-medium text-gray-700 mb-2">
                Nama Mitra
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
                disabled
                hide-details
                />
            </div>
            <!-- Tanggal Permohonan -->
            <div class="mb-4">
                <label for="tanggal-permohonan" class="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Permohonan
                </label>
                <VTextField
                id="tanggal-permohonan"
                v-model="formData.tanggalPermohonan"
                type="date"
                variant="outlined"
                density="comfortable"
                hide-details
                disabled
                />
            </div>
            <!-- Input Nominal -->
            <div class="mb-4">
                <label for="input-nominal" class="block text-sm font-medium text-gray-700 mb-2">
                Input Nominal
                </label>
                <VTextField
                id="input-nominal"
                v-model="formData.inputNominal"
                type="number"
                placeholder="Rp.100.000.000"
                variant="outlined"
                density="comfortable"
                hide-details
                disabled
                />
            </div>
            <!-- Nominal Porsi 100% -->
            <div class="mb-4">
                <label for="nominal-porsi-100" class="block text-sm font-medium text-gray-700 mb-2">
                Nominal Porsi 100%
                </label>
                <VTextField
                id="nominal-porsi-100"
                v-model="formData.nominalPorsi100"
                type="number"
                placeholder="Rp.100.000.000"
                variant="outlined"
                density="comfortable"
                hide-details
                disabled
                />
            </div>
            <!-- Nominal Porsi 25% -->
            <div class="mb-4">
                <label for="nominal-porsi-25" class="block text-sm font-medium text-gray-700 mb-2">
                Nominal Porsi 25%
                </label>
                <VTextField
                id="nominal-porsi-25"
                v-model="formData.nominalPorsi25"
                type="number"
                placeholder="Rp.100.000.000"
                variant="outlined"
                density="comfortable"
                hide-details
                disabled
                />
            </div>
            <!-- File Surat Notifikasi (View Only) -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                File Surat Notifikasi
                </label>
                <div v-if="formData.uploadedFile" class="d-flex align-center">
                <VIcon icon="tabler-file-document-outline" class="mr-2" />
                <span>{{ formData.uploadedFile.name }}</span>
                <VBtn
                    variant="text"
                    color="primary"
                    size="small"
                    class="ml-2"
                    @click="viewFile(formData.uploadedFile)"
                >
                    Lihat File
                </VBtn>
                </div>
                <div v-else class="text-gray-500 text-sm">
                Tidak ada file yang diunggah.
                </div>
            </div>
            <!-- Tombol Aksi -->
            <div class="d-flex justify-end">
                <!-- Tombol-tombol aksi baru -->
                <VBtn
                color="error"
                class="mr-2"
                @click="handleReject"
                >
                Reject
                </VBtn>
                <VBtn
                color="success"
                class="mr-2"
                @click="handleApprove"
                >
                Approve
                </VBtn>
                <VBtn
                color="warning"
                class="mr-2"
                @click="handleRevisi"
                >
                Revisi
                </VBtn>
                <!-- Tombol kembali -->
                <VBtn
                color="primary"
                @click="goBack"
                >
                Kembali Ke Menu
                </VBtn>
            </div>
            </form>
        </VCardText>
        <!-- Popup Konfirmasi Revisi -->
        <VDialog
            v-model="isRevisiDialogVisible"
            persistent
            max-width="500px"
        >
            <VCard>
            <VCardTitle class="text-h6">
                Konfirmasi Revisi
            </VCardTitle>
            <!-- Tambahkan input teks multiline untuk catatan feedback -->
            <VCardText>
                <VTextarea
                v-model="revisiNote"
                label="Saran/Keterangan/Tambahan Pengendalian *"
                :error-messages="isRevisiNoteValid ? '' : 'Catatan wajib diisi.'"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                required
                rows="4" 
                auto-grow 
                />
            </VCardText>
            <VCardText>
                {{ revisiDialogMessage }}
            </VCardText>
            <VCardActions class="d-flex justify-end gap-3 pa-4">
                <VBtn
                color="secondary"
                variant="outlined"
                @click="cancelRevisi"
                >
                Cancel
                </VBtn>
                <VBtn
                color="primary"
                variant="flat"
                @click="confirmRevisi"
                >
                Confirm
                </VBtn>
            </VCardActions>
            </VCard>
        </VDialog>
        </VCard>
    </div>
    </template>

    <script>
    import { ref } from 'vue';
    // --- Pastikan VTextarea diimpor ---
    import { VBtn, VCard, VCardActions, VCardItem, VCardText, VCardTitle, VDialog, VIcon, VSelect, VTextField, VTextarea } from 'vuetify/lib/components/index.mjs';

    export default {
    components: {
        VCard,
        VCardItem,
        VCardTitle,
        VCardText,
        VSelect,
        VTextField,
        VBtn,
        VIcon,
        VDialog,
        VCardActions,
        VTextarea // --- Tambahkan VTextarea ke komponen ---
    },
    setup() {
        // State untuk dialog revisi
        const isRevisiDialogVisible = ref(false);
        const revisiDialogMessage = ref('Apakah Anda yakin ingin merevisi pengajuan ini?');
        const revisiNote = ref(''); // Untuk menyimpan nilai input teks multiline
        const isRevisiNoteValid = ref(true); // Untuk melacak validasi

        // Methods untuk dialog revisi
        const handleRevisi = () => {
        console.log('Tombol Revisi diklik');
        revisiDialogMessage.value = 'Apakah Anda yakin ingin merevisi pengajuan ini?';
        revisiNote.value = ''; // Reset nilai input saat dialog dibuka
        isRevisiNoteValid.value = true; // Reset validasi
        isRevisiDialogVisible.value = true;
        };

        const confirmRevisi = () => {
        if (!revisiNote.value.trim()) { // Periksa apakah input kosong atau hanya spasi
            isRevisiNoteValid.value = false;
            // Opsional: Tampilkan pesan error spesifik
            // alert('Catatan wajib diisi.');
            return; // Hentikan eksekusi jika tidak valid
        }
        isRevisiNoteValid.value = true; // Reset validasi jika input valid

        isRevisiDialogVisible.value = false;
        console.log('Revisi dikonfirmasi dengan catatan:', revisiNote.value);
        alert(`Revisi dikonfirmasi.\nCatatan: ${revisiNote.value}\nJalankan logika revisi di sini.`);
        // --- Implementasi logika revisi sesungguhnya di sini ---
        // Gunakan `revisiNote.value` untuk mendapatkan teks catatannya.
        };

        const cancelRevisi = () => {
        isRevisiDialogVisible.value = false;
        console.log('Revisi dibatalkan');
        };

        return {
        isRevisiDialogVisible,
        revisiDialogMessage,
        revisiNote, // Ekspos ref untuk input teks multiline
        isRevisiNoteValid, // Ekspos ref untuk validasi
        handleRevisi,
        confirmRevisi,
        cancelRevisi
        };
    },
    data() {
        // --- Mock Data ---
        const mockFile = new File([""], "surat_notifikasi_mock.pdf", {
        type: "application/pdf",
        });
        return {
        mitraOptions: [
            { text: 'Pilih Mitra', value: '', disabled: true },
            { text: 'Bank X Indonesia', value: 'bank-x-indonesia' },
            { text: 'Bank Y Nasional', value: 'bank-y-nasional' },
            { text: 'Bank Z Internasional', value: 'bank-z-internasional' },
        ],
        formData: {
            namaMitra: 'bank-x-indonesia', // Value dari mitraOptions
            tanggalPermohonan: '2024-07-30',
            inputNominal: 100000000000, // 100 Miliar
            nominalPorsi100: 100000000000, // 100 Miliar
            nominalPorsi25: 25000000000,  // 25 Miliar
            uploadedFile: mockFile, // File mock
        },
        };
    },
    methods: {
        handleSubmit() {
        // Logika submit form jika diperlukan
        console.log('Data pengajuan:', this.formData);
        },
        goBack() {
        // Kembali ke halaman sebelumnya
        this.$router.go(-1);
        },
        viewFile(file) {
        if (file) {
            console.log('Melihat file:', file.name);
            alert(`[Simulasi] Membuka file: ${file.name}\nDalam implementasi nyata, file ini akan ditampilkan atau diunduh.`);
        }
        },
        handleReject() {
        console.log('Tombol Reject diklik');
        alert('Tombol Reject diklik. Implementasi logika reject di sini.');
        // Implementasi logika reject
        },
        handleApprove() {
        console.log('Tombol Approve diklik');
        alert('Tombol Approve diklik. Implementasi logika approve di sini.');
        // Implementasi logika approve
        },
    },
    };
    </script>

    <style scoped>
    /* Custom styles jika diperlukan */
    </style>
