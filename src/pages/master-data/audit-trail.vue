    ```vue
    <template>
    <div class="container mx-auto p-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
        <div class="d-flex align-items-center space-x-2">
            <VBtn 
            color="primary" 
            @click="openAddDialog"
            prepend-icon="tabler-plus"
            >
            Tambah baru
            </VBtn>
            <VBtn 
            color="error" 
            variant="outlined" 
            @click="deleteSelected"
            class="ml-2"
            :disabled="selectedLogs.length === 0"
            >
            Hapus
            </VBtn>
        </div>
        <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-300">
            Menampilkan {{ firstItem }} - {{ lastItem }} dari {{ totalItems }}
            </span>
            <VSelect
            v-model="itemsPerPage"
            :items="[10, 20, 50, 100]"
            density="comfortable"
            variant="outlined"
            hide-details
            class="w-32"
            />
        </div>
        </div>

        <!-- Tabel Audit Trail -->
        <VCard>
        <VTable class="audit-table">
            <thead>
            <tr>
                <th class="text-left">
                <VCheckbox 
                    v-model="selectAll" 
                    @change="toggleSelectAll"
                    density="compact"
                    hide-details
                />
                </th>
                <th>ID</th>
                <th>Datetime</th>
                <th>IP Address</th>
                <th>User</th>
                <th>Table</th>
                <th>Action</th>
                <th>Description</th>
                <th>Aksi</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(log, index) in displayedLogs" :key="log.id">
                <td>
                <VCheckbox 
                    :value="log.id" 
                    v-model="selectedLogs"
                    density="compact"
                    hide-details
                />
                </td>
                <td>{{ log.id }}</td>
                <td>{{ formatDate(log.datetime) }}</td>
                <td>{{ log.ipAddress }}</td>
                <td>{{ log.user }}</td>
                <td>{{ log.table }}</td>
                <td>{{ log.action }}</td>
                <td>{{ log.description }}</td>
                <td>
                <div class="d-flex gap-1">
                    <VBtn
                    icon
                    color="warning"
                    size="small"
                    @click="openEditDialog(log)"
                    >
                    <VIcon icon="tabler-edit" />
                    </VBtn>
                    <VBtn
                    icon
                    color="error"
                    size="small"
                    @click="openDeleteDialog(log)"
                    >
                    <VIcon icon="tabler-trash" />
                    </VBtn>
                </div>
                </td>
            </tr>
            </tbody>
        </VTable>

        <!-- Paginasi -->
        <div class="d-flex justify-space-between align-center pa-4 bg-background">
            <div class="text-body-2 text-medium-emphasis">
            Menampilkan {{ firstItem }} sampai {{ lastItem }} dari {{ totalItems }} log
            </div>
            <VPagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            density="comfortable"
            />
        </div>
        </VCard>

        <!-- Dialog Tambah/Edit -->
        <VDialog v-model="dialogVisible" max-width="600px">
        <VCard>
            <VCardTitle>
            <span class="text-h5">{{ isEdit ? 'Edit Log' : 'Tambah Log Baru' }}</span>
            </VCardTitle>
            <VCardText>
            <VForm ref="form" @submit.prevent="saveLog">
                <VRow>
                <VCol cols="12">
                    <VTextField
                    v-model="currentLog.datetime"
                    label="Datetime"
                    type="datetime-local"
                    :rules="[v => !!v || 'Datetime harus diisi']"
                    required
                    />
                </VCol>
                <VCol cols="12">
                    <VTextField
                    v-model="currentLog.ipAddress"
                    label="IP Address"
                    :rules="[v => !!v || 'IP Address harus diisi']"
                    required
                    />
                </VCol>
                <VCol cols="12">
                    <VTextField
                    v-model="currentLog.user"
                    label="User"
                    :rules="[v => !!v || 'User harus diisi']"
                    required
                    />
                </VCol>
                <VCol cols="12">
                    <VTextField
                    v-model="currentLog.table"
                    label="Table"
                    :rules="[v => !!v || 'Table harus diisi']"
                    required
                    />
                </VCol>
                <VCol cols="12">
                    <VTextField
                    v-model="currentLog.action"
                    label="Action"
                    :rules="[v => !!v || 'Action harus diisi']"
                    required
                    />
                </VCol>
                <VCol cols="12">
                    <VTextField
                    v-model="currentLog.description"
                    label="Description"
                    textarea
                    />
                </VCol>
                </VRow>
            </VForm>
            </VCardText>
            <VCardActions>
            <VSpacer></VSpacer>
            <VBtn color="blue-darken-1" variant="text" @click="closeDialog">
                Batal
            </VBtn>
            <VBtn color="blue-darken-1" variant="text" @click="saveLog">
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
            Apakah Anda yakin ingin menghapus log ini?
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

        <!-- Dialog Konfirmasi Hapus Multiple -->
        <VDialog v-model="deleteMultipleDialog" max-width="450px">
        <VCard>
            <VCardTitle class="text-h5">
            Konfirmasi Hapus
            </VCardTitle>
            <VCardText>
            Apakah Anda yakin ingin menghapus {{ selectedLogs.length }} log yang dipilih?
            </VCardText>
            <VCardActions>
            <VSpacer></VSpacer>
            <VBtn color="blue-darken-1" variant="text" @click="closeDeleteMultipleDialog">
                Batal
            </VBtn>
            <VBtn color="error" variant="text" @click="confirmDeleteMultiple">
                Hapus
            </VBtn>
            </VCardActions>
        </VCard>
        </VDialog>
    </div>
    </template>

    <script setup lang="ts">
    import { computed, reactive, ref, watch } from 'vue'
import {
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VCheckbox,
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

    interface AuditLog {
    id: number
    datetime: string
    ipAddress: string
    user: string
    table: string
    action: string
    description: string
    }

    // Mock data - nanti akan diambil dari store atau API
    const auditLogs = ref<AuditLog[]>([
    {
        id: 438,
        datetime: '2023-07-31T11:01:43',
        ipAddress: '192.168.90.100',
        user: 'wahyu.januar@smf-indonesia.co.id',
        table: 'user',
        action: 'login',
        description: ''
    },
    {
        id: 437,
        datetime: '2023-07-31T10:51:46',
        ipAddress: '192.168.90.100',
        user: 'wahyu.januar@smf-indonesia.co.id',
        table: 'user',
        action: 'logout',
        description: ''
    }
    ])

    // State untuk paginasi
    const itemsPerPage = ref(20)
    const currentPage = ref(1)

    // State untuk checkbox
    const selectedLogs = ref<number[]>([])
    const selectAll = ref(false)

    // State untuk dialog
    const dialogVisible = ref(false)
    const deleteDialog = ref(false)
    const deleteMultipleDialog = ref(false)
    const isEdit = ref(false)

    // State untuk form data
    const currentLog = reactive<AuditLog>({
    id: 0,
    datetime: '',
    ipAddress: '',
    user: '',
    table: '',
    action: '',
    description: ''
    })

    const logToDelete = ref<AuditLog | null>(null)

    // Computed properties untuk paginasi
    const totalItems = computed(() => auditLogs.value.length)
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

    const firstItem = computed(() => {
    return totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
    })

    const lastItem = computed(() => {
    return Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
    })

    const displayedLogs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return auditLogs.value.slice(start, end)
    })

    // Methods
    function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
    }

    function openAddDialog() {
    isEdit.value = false
    Object.assign(currentLog, {
        id: 0,
        datetime: '',
        ipAddress: '',
        user: '',
        table: '',
        action: '',
        description: ''
    })
    dialogVisible.value = true
    }

    function openEditDialog(log: AuditLog) {
    isEdit.value = true
    Object.assign(currentLog, { ...log })
    dialogVisible.value = true
    }

    function closeDialog() {
    dialogVisible.value = false
    }

    function openDeleteDialog(log: AuditLog) {
    logToDelete.value = log
    deleteDialog.value = true
    }

    function closeDeleteDialog() {
    deleteDialog.value = false
    logToDelete.value = null
    }

    function openDeleteMultipleDialog() {
    deleteMultipleDialog.value = true
    }

    function closeDeleteMultipleDialog() {
    deleteMultipleDialog.value = false
    }

    function saveLog() {
    if (isEdit.value) {
        // Update existing log
        const index = auditLogs.value.findIndex(log => log.id === currentLog.id)
        if (index !== -1) {
        auditLogs.value[index] = { ...currentLog }
        }
    } else {
        // Add new log
        const newLog = {
        ...currentLog,
        id: Math.max(...auditLogs.value.map(log => log.id), 0) + 1
        }
        auditLogs.value.unshift(newLog)
    }
    closeDialog()
    }

    function confirmDelete() {
    if (logToDelete.value) {
        auditLogs.value = auditLogs.value.filter(log => log.id !== logToDelete.value?.id)
        // Hapus dari selectedLogs jika ada
        selectedLogs.value = selectedLogs.value.filter(id => id !== logToDelete.value?.id)
    }
    closeDeleteDialog()
    }

    function deleteSelected() {
    if (selectedLogs.value.length > 0) {
        openDeleteMultipleDialog()
    }
    }

    function confirmDeleteMultiple() {
    auditLogs.value = auditLogs.value.filter(log => !selectedLogs.value.includes(log.id))
    selectedLogs.value = []
    selectAll.value = false
    closeDeleteMultipleDialog()
    }

    function toggleSelectAll() {
    if (selectAll.value) {
        selectedLogs.value = displayedLogs.value.map(log => log.id)
    } else {
        selectedLogs.value = []
    }
    }

    // Watch untuk selectAll
    watch(selectedLogs, (newVal) => {
    selectAll.value = newVal.length === displayedLogs.value.length && displayedLogs.value.length > 0
    })
    </script>

    <style scoped>
    .audit-table th {
    background-color: #1e1e1e !important;
    color: white !important;
    font-weight: 600;
    padding: 12px 16px !important;
    }

    .audit-table td {
    padding: 12px 16px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
    }

    .audit-table tr:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
    }

    .v-pagination {
    justify-content: center !important;
    }
    </style>
    ```
