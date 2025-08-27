    <script setup lang="ts">
    import HistoryPanel from '@/pages/detail/history-panel.vue'; // <-- Path yang benar berdasarkan informasi kamu
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; // [!code ++] // Impor useRouter untuk routing

    // Import komponen Vuetify jika diperlukan
    // import { ... } from 'vuetify/lib/components/index.mjs'
    // --- Mock Data ---
    const mockDetailInboxData = {
    id: 1,
    id_pengjuan: 101,
    risk_id: 'RR-2024-001',
    full_name: 'Budi Santoso',
    created_at: '2024-07-28T10:22:00Z',
    status_name: 'Verifikator Co', 
    new_form: 1, // 1 untuk form baru, 0 untuk form lama
    duplicate_num: 1
    };

    const mockDetailInboxData2 = [
    {
        id_log: 1,
        id_pengajuan: 101,
        status_name: 1, // 1: Diajukan
        description_status: 'Pengajuan risiko oleh Maker',
        confirm_status: 1, // 1: Menunggu
        created_at: '2024-07-28T09:00:00Z',
        updated_by: 'Budi Santoso (Maker)'
    },
    {
        id_log: 2,
        id_pengajuan: 101,
        status_name: 2, // 2: Diperiksa
        description_status: 'Verifikasi data oleh Checker',
        confirm_status: 2, // 2: Disetujui
        created_at: '2024-07-28T11:30:00Z',
        updated_by: 'Ani Wijaya (Checker)'
    },
    {
        id_log: 3,
        id_pengajuan: 101,
        status_name: 3, // 3: Disetujui
        description_status: 'Risiko disetujui untuk dilanjutkan',
        confirm_status: 2, // 2: Disetujui
        created_at: '2024-07-28T13:45:00Z',
        updated_by: 'Supervisor Risk'
    }
    ];

    // --- Inisialisasi Router ---
    const router = useRouter(); // [!code ++] // Inisialisasi instance router

    // --- Reactive State ---
    const detailInboxData = ref({...mockDetailInboxData});
    const detailInboxData2 = ref([...mockDetailInboxData2]);
    const isDialogVisible = ref(false);
    const isDialogLoading = ref(false);
    const isSnackbarVisible = ref(false);
    const loadingAja = ref(false);
    const navigationTab = ref('History');
    const tabItems = ['History'];
    const dialogTitle = ref('');
    const dialogMessage = ref('');
    const snackBarText = ref('');
    const snackBarColour = ref('');
    const selectedAction = ref('');
    // const router = useRouter(); // Baris ini dihapus karena sudah dideklarasikan di atas // [!code --]

    // --- Methods untuk Formatting ---
    const formattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    };

    const resolveStatusApprovalCaption = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'disetujui': return 'Disetujui';
        case 'ditolak': return 'Ditolak';
        case 'pending':
        case 'dalam proses': return 'Dalam Proses';
        default: return status;
    }
    };

    const resolveStatusApprovalVariant = (role: string): string => {
    switch (role.toLowerCase()) {
        case 'staff co': return 'purple';
        case 'verifikator co': return 'orange';
        case 'approver co': return 'teal';
        case 'admin ti': return 'pink';
        default: return 'default';
    }
    };

    // --- Methods untuk Navigasi & Actions ---
    const navigateToFormDetail = (id: number) => { // [!code focus] // Fungsi navigasi diperbarui
    console.log(`Navigasi ke form detail risiko dengan ID: ${id}`);
    router.push({ name: 'detail-form-detail-id', params: { id } }); // [!code ++]  // [!code ++] // Gunakan router.push untuk navigasi
    // Jika path-nya berbeda, sesuaikan path di dalam push().
    // Contoh: router.push(`/permohonan/form-detail/${id}`);
    };

    const closeDialog = () => {
    isDialogVisible.value = false;
    };

    const confirmAction = async () => {
    isDialogVisible.value = false;
    console.log(`Tindakan dikonfirmasi: ${selectedAction.value}`);
    alert(`Tindakan dikonfirmasi: ${selectedAction.value}`);
    
    // Simulasi loading
    isDialogLoading.value = true;
    setTimeout(() => {
        isDialogLoading.value = false;
        snackBarText.value = selectedAction.value === 'reject' ? 'Berhasil Ditolak!' : 'Berhasil Disetujui!';
        snackBarColour.value = selectedAction.value === 'reject' ? 'error' : 'success';
        isSnackbarVisible.value = true;
        
        // Update status mock setelah approve/reject jika diperlukan
        if (selectedAction.value !== 'reject') {
        detailInboxData.value.status_name = 'Disetujui';
        } else {
        detailInboxData.value.status_name = 'Ditolak';
        }
    }, 1500);
    };

    // --- Lifecycle ---
    onMounted(async () => {
    console.log('Komponen Detail Risiko (Mock) dimuat.');
    // Tidak perlu fetch data karena menggunakan mock
    });
    </script>

    <template>
    <VCard class="overflow-visible course-details">
        <div class="w-100 sticky-header" />
        <div
        v-if="detailInboxData.status_name !== '0'"
        class="d-flex align-center gap-4 flex-wrap bg-background py-6"
        >
        <VCardTitle>Action :</VCardTitle>
        <VSpacer />
        <div>
            <div class="d-flex gap-4 mr-4">
            <VBtn
                color="primary"
                @click="navigateToFormDetail(detailInboxData.id_pengjuan)"
            >
                Form Detail
            </VBtn>
            <!-- Contoh tombol approve/reject jika diperlukan -->
            <!--
            <VBtn color="success" @click="() => { selectedAction = 'approve'; dialogTitle='Konfirmasi Approve'; dialogMessage='Apakah Anda yakin ingin menyetujui risiko ini?'; isDialogVisible = true; }">
                Approve
            </VBtn>
            <VBtn color="error" @click="() => { selectedAction = 'reject'; dialogTitle='Konfirmasi Reject'; dialogMessage='Apakah Anda yakin ingin menolak risiko ini?'; isDialogVisible = true; }">
                Reject
            </VBtn>
            -->
            </div>
            <!-- Dialog untuk Konfirmasi -->
            <VDialog
            v-model="isDialogVisible"
            persistent
            class="v-dialog-sm"
            >
            <VCard :title="dialogTitle">
                <VCardText>
                {{ dialogMessage }}
                </VCardText>
                <VCardActions class="d-flex justify-end gap-3 flex-wrap">
                <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="closeDialog"
                >
                    Cancel
                </VBtn>
                <VBtn
                    color="primary"
                    variant="tonal"
                    @click="confirmAction"
                >
                    Yes
                </VBtn>
                </VCardActions>
            </VCard>
            </VDialog>
        </div>
        </div>
        <VCardText>
        <VRow>
            <VCol cols="2" md="12">
            <VCardItem class="pa-0 mb-2">
                <div class="d-flex justify-space-between">
                <VCardSubtitle>
                    From :
                    <span class="font-weight-medium text-high-emphasis ms-1">{{ detailInboxData.full_name }}</span>
                </VCardSubtitle>
                <VCardSubtitle>
                    Date :
                    <span class="font-weight-medium text-high-emphasis ms-1">{{ formattedDate(detailInboxData.created_at) }}</span>
                </VCardSubtitle>
                </div>
            </VCardItem>
            <VCard flat>
                <VCardText>
                <div class="d-flex justify-space-between">
                    <div>
                    </div>
                    <div class="mt-2">
                    <VBtn
                        color="info"
                        size="small"
                        variant="tonal"
                        disabled
                    >
                        {{ getStatusRole(detailInboxData2[detailInboxData2.length - 1]?.status_name) }}
                    </VBtn>
                    </div>
                    </div>
                </VCardText>
            </VCard>
            </VCol>
        </VRow>
        </VCardText>
    </VCard>
    <!-- Bagian History Panel -->
    <VCard class="mt-3">
        <VCardText>
        <VCardTitle>History</VCardTitle>
        <!-- Kirim data mockup sebagai props -->
        <HistoryPanel :data-incident-log="detailInboxData2" />
        </VCardText>
    </VCard>
    <!-- Snackbar -->
    <VSnackbar
        v-model="isSnackbarVisible"
        transition="scroll-y-reverse-transition"
        location="top end"
        :timeout="2000"
        :color="snackBarColour"
    >
        {{ snackBarText }}
    </VSnackbar>
    <!-- Dialog Loading -->
    <VDialog
        v-model="loadingAja"
        persistent
        width="300"
    >
        <VCard color="primary" width="300">
        <VCardText class="pt-3">
            Loading...! Please stand by
            <VProgressLinear
            indeterminate
            color="white"
            :height="8"
            class="mb-0 mt-4"
            />
        </VCardText>
        </VCard>
    </VDialog>
    </template>

    <style lang="scss" scoped>
    .card-list {
    --v-card-list-gap: 1rem;
    }
    .course-content {
    position: sticky;
    inset-block-start: 5.25rem;
    }

    /* Helper functions untuk styling */
    </style>

    <!-- Methods tambahan untuk template -->
    <script lang="ts">
    // Tambahkan ini di dalam blok <script setup> jika perlu
    function getStatusRole(statusNumber: number): string {
    switch (statusNumber) {
        case 1: return 'Diajukan';
        case 2: return 'Staff Co';
        case 3: return 'Verifikator Co';
        case 4: return 'Approver Co';
        default: return 'Status Tidak Dikenal';
    }
    }

    function getStatusColor(confirmStatus: number): string {
    switch (confirmStatus) {
        case 1: return 'warning'; // Menunggu
        case 2: return 'success'; // Disetujui
        case 3: return 'error';   // Ditolak
        case 4: return 'info';    // Informasi
        default: return 'default';
    }
    }
    </script>
