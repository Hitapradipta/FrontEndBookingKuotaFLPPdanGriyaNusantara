    <script setup lang="ts">
    // --- Bagian Script ---
    import { ref } from 'vue'
    // Import helper jika benar-benar tersedia secara lokal/mock, atau definisikan fungsi di sini
    // import * as helperAllResolve from '@/helpers/allResolve'
    // Untuk contoh ini, kita definisikan fungsi-fungsi yang diperlukan secara lokal

    // --- Mock Data ---
    // Data mock untuk user
    const userData = ref({
    support_level: 'L0', // Bisa diubah untuk testing kondisi
    // ... data user lainnya jika diperlukan
    })

    // Data mock untuk log insiden
    const LogData = ref([
    {
        id: 1,
        confirm_status: 1, // Pending
        ticket_status: 'Open',
        created_at: '2024-07-28T09:00:00Z',
        full_name: 'Budi Santoso',
        description_status: 'Pengajuan insiden oleh pengguna. Menunggu verifikasi awal.',
    },
    {
        id: 2,
        confirm_status: 2, // Dalam Proses
        ticket_status: 'In Progress',
        created_at: '2024-07-28T11:30:00Z',
        full_name: 'Ani Wijaya (Support L1)',
        description_status: 'Insiden sedang dalam investigasi. Memeriksa log sistem.',
    },
    {
        id: 3,
        confirm_status: 4, // Disetujui / Diteruskan
        ticket_status: 'Escalated',
        created_at: '2024-07-28T14:15:00Z',
        full_name: 'Supervisor IT',
        description_status: 'Insiden diverifikasi dan diteruskan ke tim ahli untuk penanganan lebih lanjut.',
    },
    {
        id: 4,
        confirm_status: 5, // Informasi
        ticket_status: 'Information',
        created_at: '2024-07-28T16:45:00Z',
        full_name: 'Sistem Notifikasi',
        description_status: 'Notifikasi status: Insiden sedang ditangani. Perkiraan penyelesaian 2 hari kerja.',
    },
    {
        id: 5,
        confirm_status: 3, // Diselesaikan
        ticket_status: 'Resolved',
        created_at: '2024-07-29T10:00:00Z',
        full_name: 'Ahmad Riyadi (Support L3)',
        description_status: 'Masalah telah diidentifikasi dan diperbaiki. Sistem kembali normal.',
    },
    ])

    // Data mock untuk lampiran
    const attachmentData = ref([
    {
        transIncLogId: 1, // Terkait dengan log ID 1
        title: 'laporan_awal_insiden.pdf',
    },
    {
        transIncLogId: 2, // Terkait dengan log ID 2
        title: 'screenshot_error.png',
    },
    {
        transIncLogId: 3, // Terkait dengan log ID 3
        title: 'dokumen_analisis.docx',
    },
    {
        transIncLogId: 5, // Terkait dengan log ID 5
        title: 'bukti_perbaikan.jpg',
    },
    ])

    // --- Fungsi Helper (Mock) ---
    // Karena helper tidak tersedia, kita definisikan di sini
    const resolveConfirmStatusCaption = (status: number): string => {
    switch (status) {
        case 1: return 'Pending'
        case 2: return 'Dalam Proses'
        case 3: return 'Diselesaikan'
        case 4: return 'Disetujui'
        case 5: return 'Informasi'
        default: return 'Status Tidak Dikenal'
    }
    }

    const getConfirmStatusColor = (status: number): string => {
    switch (status) {
        case 1: return 'warning' // Pending
        case 2: return 'info'    // Dalam Proses
        case 3: return 'success' // Diselesaikan
        case 4: return 'primary' // Disetujui
        case 5: return 'secondary' // Informasi
        default: return 'default'
    }
    }

    // Fungsi untuk mendapatkan warna dot timeline berdasarkan status
    const getDotColor = (status: number): string => {
    // Gunakan logika yang sama dengan getConfirmStatusColor untuk konsistensi visual
    return getConfirmStatusColor(status)
    }

    // Fungsi untuk memformat tanggal
    const formattedDate = (dateString: string): string => {
    const inputDate = new Date(dateString)

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]

    const dayOfWeek = days[inputDate.getDay()]
    const day = inputDate.getDate()
    const month = months[inputDate.getMonth()]
    const year = inputDate.getFullYear()
    const hour = inputDate.getHours()
    const minute = inputDate.getMinutes()
    const minuteStr = minute < 10 ? `0${minute}` : minute

    return `${dayOfWeek}, ${day} ${month} ${year}, ${hour}:${minuteStr}`
    }

    // Fungsi untuk menentukan teks tombol berdasarkan ekstensi file
    const getButtonText = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || ''
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
        return 'Lihat Lampiran'
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) {
        return 'Unduh Lampiran'
    } else {
        return 'Akses Lampiran' // Untuk jenis file lain
    }
    }

    // --- State untuk Modal Gambar (Mock) ---
    const isDialogVisible = ref(false)
    const imageUrl = ref('')

    // Fungsi untuk menangani klik pada lampiran (simulasi)
    const handleAttachmentClick = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || ''
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
        // Simulasi membuka modal gambar
        imageUrl.value = `https://placehold.co/600x400/cccccc/969696?text=${encodeURIComponent(fileName)}`
        isDialogVisible.value = true
        console.log(`[MOCK] Membuka modal untuk melihat gambar: ${fileName}`)
    } else {
        // Simulasi mengunduh file
        console.log(`[MOCK] Mengunduh file: ${fileName}`)
        alert(`[Simulasi] Mengunduh file: ${fileName}\nDalam implementasi nyata, ini akan memulai unduhan.`)
    }
    }

    // Fungsi untuk menutup modal (simulasi)
    const closeModal = () => {
    isDialogVisible.value = false
    imageUrl.value = ''
    }
    </script>

    <template>
    <!-- Bagian Template -->
    <VRow class="scrolled-div mt-1">
        <VCol cols="12" md="12">
        <VCardText>
            <!-- Timeline Utama -->
            <VTimeline
            truncate-line="both"
            align="start"
            side="end"
            line-color="primary"
            density="compact"
            class="v-timeline-density-compact"
            >
            <!-- Item Timeline diulang untuk setiap log insiden mock -->
            <VTimelineItem
                v-for="log in LogData"
                :key="log.id"
                :dot-color="getDotColor(log.confirm_status)"
                size="x-small"
            >
                <!-- Header Item Timeline -->
                <div class="d-flex justify-space-between align-center items-center flex-wrap">
                <!-- Status Chip -->
                <VChip
                    class="ma-0 pa-2 text-capitalize"
                    :color="getDotColor(log.confirm_status)"
                    text-color=""
                    label
                    small
                >
                    {{ resolveConfirmStatusCaption(log.confirm_status) }}
                </VChip>

                <!-- Metadata (Tanggal & Pembuat) -->
                <div class="d-flex align-center gap-2 flex-wrap">
                    <div class="app-timeline-meta text-caption">
                    {{ formattedDate(log.created_at) }}
                    </div>
                    <div class="app-timeline-meta text-caption">
                    <span>Oleh : </span>
                    <b class="font-weight-medium">{{ log.full_name }}</b>
                    </div>
                </div>
                </div>

                <!-- Deskripsi Status -->
                <!-- Tampilkan deskripsi jika tiket belum selesai atau user adalah L0 -->
                <p
                v-if="log.ticket_status !== 'Resolved' || userData.support_level === 'L0'"
                class="app-timeline-text mb-0 my-3 text-body-2"
                style="max-width: 80%;"
                >
                {{ log.description_status }}
                </p>
                <!-- Jika tiket selesai dan user bukan L0, tampilkan tanggal saja (opsional) -->
                <p
                v-else-if="log.ticket_status === 'Resolved'"
                class="app-timeline-text mb-0 text-body-2 text--disabled"
                >
                Insiden diselesaikan pada {{ formattedDate(log.created_at) }}
                </p>

                <!-- Lampiran -->
                <!-- Tampilkan tombol untuk setiap lampiran yang terkait dengan log ini -->
                <div
                v-for="attachment in attachmentData.filter(a => a.transIncLogId === log.id)"
                :key="`${log.id}-${attachment.title}`"
                class="mt-2"
                >
                <VBtn
                    variant="outlined"
                    size="small"
                    @click="handleAttachmentClick(attachment.title)"
                >
                    {{ getButtonText(attachment.title) }}
                </VBtn>
                </div>
            </VTimelineItem>
            </VTimeline>
        </VCardText>
        </VCol>
    </VRow>

    <!-- Modal untuk Menampilkan Gambar (Mock) -->
    <VDialog v-model="isDialogVisible" max-width="700px">
        <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
            <span>Pratinjau Gambar</span>
            <VBtn icon @click="closeModal">
            <VIcon>tabler-x</VIcon>
            </VBtn>
        </VCardTitle>
        <VCardText class="d-flex justify-center">
            <VImg
            v-if="imageUrl"
            :src="imageUrl"
            :alt="'Gambar Lampiran'"
            contain
            max-height="500px"
            />
            <p v-else class="text-center text--disabled">Tidak ada gambar untuk ditampilkan.</p>
        </VCardText>
        <VCardActions class="justify-center">
            <VBtn color="primary" @click="closeModal">Tutup</VBtn>
        </VCardActions>
        </VCard>
    </VDialog>
    </template>

    <style scoped>
    /* Gaya untuk area scroll */
    .scrolled-div {
    min-height: 150px;
    max-height: 400px;
    overflow-y: auto;
    padding: 8px; /* Tambahkan sedikit padding */
    }

    /* Gaya untuk teks timeline */
    .app-timeline-text {
    white-space: pre-wrap; /* Pertahankan line breaks jika ada */
    }

    /* Gaya untuk metadata timeline */
    .app-timeline-meta {
    color: #8d8b95; /* Warna teks sekunder/disabled */
    }

    /* Gaya untuk tombol aksi */
    .v-btn--outlined {
    border-color: rgba(255, 255, 255, 0.3);
    }
    </style>
