    Masalahnya adalah karena custom color classes tidak dikenali oleh Vuetify. Kita perlu menggunakan pendekatan yang berbeda. Berikut adalah solusi yang benar:

    ```vue
    <template>
    <div class="container mx-auto p-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-black">Daftar Mitra</h1>
        <VBtn 
            color="primary" 
            @click="openAddUserDialog"
            prepend-icon="tabler-plus"
        >
            Tambah Mitra
        </VBtn>
        </div>

        <!-- Tabel Daftar Mitra -->
        <VCard>
        <VDataTable
            :headers="[
            { title: 'ID', key: 'id' },
            { title: 'Full Name', key: 'fullName' },
            { title: 'Username', key: 'username' },
            { title: 'Email', key: 'email' },
            { title: 'Role', key: 'role' },
            { title: 'Status', key: 'status' },
            { title: 'Action', key: 'actions', sortable: false }
            ]"
            :items="users"
            class="text-no-wrap"
        >
            <template #item.role="{ item }">
            <div class="d-flex flex-column">
                <VChip
                v-for="role in item.role"
                :key="role"
                :style="getRoleChipStyle(role)"
                size="small"
                class="ma-1"
                >
                {{ role }}
                </VChip>
            </div>
            </template>

            <template #item.status="{ item }">
            <VChip
                :color="item.status === 'Active' ? 'success' : item.status === 'Inactive' ? 'error' : 'warning'"
                size="small"
            >
                {{ item.status }}
            </VChip>
            </template>

            <template #item.actions="{ item }">
            <div class="d-flex gap-1">
                <VBtn
                icon
                color="warning"
                size="small"
                @click="openEditUserDialog(item)"
                >
                <VIcon icon="tabler-edit" />
                </VBtn>
                <VBtn
                icon
                color="error"
                size="small"
                @click="openDeleteDialog(item)"
                >
                <VIcon icon="tabler-trash" />
                </VBtn>
            </div>
            </template>
            
            <template #bottom>
            <div class="custom-footer">
                <!-- Footer akan mengikuti tema default -->
            </div>
            </template>
        </VDataTable>
        </VCard>

        <!-- Dialog Tambah/Edit User -->
        <VDialog
        :width="$vuetify.display.smAndDown ? 'auto' : 677"
        :model-value="isDialogVisible"
        @update:model-value="dialogModelValueUpdate"
        >
        <VCard class="pa-sm-8 pa-5">
            <VCardItem class="text-center">
            <VCardTitle class="text-h3 mb-3">
                {{ selectedUser?.id ? 'Edit User' : 'Add New User' }}
            </VCardTitle>
            <p class="mb-0">
                {{ selectedUser?.id ? 'Edit user information' : 'Add new user information' }}
            </p>
            </VCardItem>

            <VCardText>
            <VForm
                ref="form"
                class="mt-6"
                @submit.prevent="onFormSubmit"
            >
                <VRow>
                <!-- Full Name -->
                <VCol
                    cols="12"
                    md="6"
                >
                    <VTextField
                    v-model="userData.fullName"
                    label="Full Name"
                    :rules="[(v: any) => !!v || 'Full name is required']"
                    required
                    />
                </VCol>

                <!-- Username -->
                <VCol
                    cols="12"
                    md="6"
                >
                    <VTextField
                    v-model="userData.username"
                    label="Username"
                    :rules="[(v: any) => !!v || 'Username is required']"
                    required
                    />
                </VCol>

                <!-- Email -->
                <VCol
                    cols="12"
                    md="6"
                >
                    <VTextField
                    v-model="userData.email"
                    label="Email"
                    type="email"
                    :rules="[(v: any) => !!v || 'Email is required', (v: any) => /.+@.+\..+/.test(v) || 'Email must be valid']"
                    required
                    />
                </VCol>

                <!-- Role (Multiple Select) -->
                <VCol
                    cols="12"
                    md="6"
                >
                    <VSelect
                    v-model="userData.role"
                    :items="roleOptions"
                    label="Role"
                    multiple
                    chips
                    closable-chips
                    :rules="[(v: any) => v.length > 0 || 'At least one role is required']"
                    required
                    />
                </VCol>

                <!-- Status -->
                <VCol
                    cols="12"
                    md="6"
                >
                    <VSelect
                    v-model="userData.status"
                    :items="statusOptions"
                    label="Status"
                    :rules="[(v: any) => !!v || 'Status is required']"
                    required
                    />
                </VCol>

                <!-- Submit and Cancel -->
                <VCol
                    cols="12"
                    class="d-flex flex-wrap justify-center gap-4"
                >
                    <VBtn type="submit" :loading="isSubmitting">
                    {{ selectedUser?.id ? 'Update' : 'Submit' }}
                    </VBtn>

                    <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="onFormReset"
                    >
                    Cancel
                    </VBtn>
                </VCol>
                </VRow>
            </VForm>
            </VCardText>
        </VCard>
        </VDialog>

        <!-- Dialog Konfirmasi Hapus -->
        <VDialog v-model="deleteDialog" max-width="450px">
        <VCard>
            <VCardTitle class="text-h5">
            Konfirmasi Hapus
            </VCardTitle>
            <VCardText>
            Apakah Anda yakin ingin menghapus user {{ userToDelete?.fullName }}?
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
    </div>
    </template>

    <script setup lang="ts">
    import { reactive, ref } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

    interface UserData {
    id: number | null
    fullName: string
    username: string
    email: string
    role: string[]
    status: string
    }

    // Data users dengan nama dummy yang tidak tumpang tindih
    const users = ref<UserData[]>([
    {
        id: 1,
        fullName: 'Ahmad Santoso',
        username: 'ahmadsantoso',
        email: 'ahmad.santoso@example.com',
        role: ['FLPP', 'Grinus'],
        status: 'Active'
    },
    {
        id: 2,
        fullName: 'Budi Prasetyo',
        username: 'budiprasetyo',
        email: 'budi.prasetyo@example.com',
        role: ['FLPP'],
        status: 'Active'
    },
    {
        id: 3,
        fullName: 'Citra Dewi',
        username: 'citradewi',
        email: 'citra.dewi@example.com',
        role: ['Grinus'],
        status: 'Inactive'
    },
    {
        id: 4,
        fullName: 'Dedi Kurniawan',
        username: 'dedikurniawan',
        email: 'dedi.kurniawan@example.com',
        role: ['FLPP', 'Grinus'],
        status: 'Pending'
    },
    {
        id: 5,
        fullName: 'Eka Putri',
        username: 'ekaputri',
        email: 'eka.putri@example.com',
        role: ['Grinus'],
        status: 'Active'
    }
    ])

    // State untuk dialog
    const isDialogVisible = ref(false)
    const selectedUser = ref<UserData | null>(null)
    const userData = reactive<UserData>({
    id: null,
    fullName: '',
    username: '',
    email: '',
    role: [],
    status: ''
    })

    // State untuk form validation
    const form = ref<any>(null)
    const isSubmitting = ref(false)

    // State untuk delete dialog
    const deleteDialog = ref(false)
    const userToDelete = ref<UserData | null>(null)

    // Options
    const roleOptions = [
    { title: 'FLPP', value: 'FLPP' },
    { title: 'Grinus', value: 'Grinus' }
    ]

    const statusOptions = [
    { title: 'Active', value: 'Active' },
    { title: 'Inactive', value: 'Inactive' },
    { title: 'Pending', value: 'Pending' }
    ]

    // Function untuk mendapatkan style chip berdasarkan role
    function getRoleChipStyle(role: string) {
    if (role === 'FLPP') {
        return {
        backgroundColor: '#6abd4b',
        color: 'white'
        }
    } else if (role === 'Grinus') {
        return {
        backgroundColor: '#7921eb',
        color: 'white'
        }
    }
    return {}
    }

    // Methods untuk dialog user
    function openAddUserDialog() {
    selectedUser.value = null
    Object.assign(userData, {
        id: null,
        fullName: '',
        username: '',
        email: '',
        role: [],
        status: ''
    })
    isDialogVisible.value = true
    }

    function openEditUserDialog(user: UserData) {
    selectedUser.value = user
    Object.assign(userData, { ...user })
    isDialogVisible.value = true
    }

    function dialogModelValueUpdate(val: boolean) {
    isDialogVisible.value = val
    }

    async function onFormSubmit() {
    const { valid } = await form.value.validate()
    
    if (valid) {
        isSubmitting.value = true
        
        // Simulasi proses submit
        setTimeout(() => {
        if (selectedUser.value?.id) {
            // Update existing user
            const index = users.value.findIndex(u => u.id === selectedUser.value?.id)
            if (index !== -1) {
            users.value[index] = { ...userData }
            }
        } else {
            // Add new user
            const newUser = {
            ...userData,
            id: Math.max(...users.value.map(u => u.id || 0), 0) + 1
            }
            users.value.push(newUser)
        }
        
        isSubmitting.value = false
        isDialogVisible.value = false
        }, 500)
    }
    }

    function onFormReset() {
    if (selectedUser.value) {
        Object.assign(userData, { ...selectedUser.value })
    } else {
        Object.assign(userData, {
        id: null,
        fullName: '',
        username: '',
        email: '',
        role: [],
        status: ''
        })
    }
    isDialogVisible.value = false
    }

    // Methods untuk delete dialog
    function openDeleteDialog(user: UserData) {
    userToDelete.value = user
    deleteDialog.value = true
    }

    function closeDeleteDialog() {
    deleteDialog.value = false
    userToDelete.value = null
    }

    function confirmDelete() {
    if (userToDelete.value?.id) {
        users.value = users.value.filter(u => u.id !== userToDelete.value?.id)
    }
    closeDeleteDialog()
    }
    </script>

    <style scoped>
    /* Menghapus style khusus untuk footer agar mengikuti tema default */
    .v-data-table {
    background-color: white;
    }

    .v-chip {
    font-weight: 500;
    }

    /* Menambahkan spacing untuk mencegah tumpang tindih teks */
    .v-data-table :deep(td) {
    padding: 12px 16px !important;
    }

    .v-data-table :deep(th) {
    padding: 12px 16px !important;
    }

    /* Memastikan footer mengikuti tema default */
    :deep(.v-data-table-footer) {
    background-color: inherit !important;
    color: inherit !important;
    }
    </style>
    ```
