    ```vue
    <template>
    <div class="container mx-auto p-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-black">Daftar Produk</h1>
        </div>

        <!-- Tabel Daftar Produk -->
        <VCard>
        <VDataTable
            :headers="[
            { title: 'ID', key: 'id' },
            { title: 'Product', key: 'product' },
            { title: 'Deskripsi', key: 'description' }
            ]"
            :items="products"
            class="text-no-wrap"
            hide-default-footer
        >
            <template #item.product="{ item }">
            <VChip
                :style="getProductChipStyle(item.product)"
                size="small"
            >
                {{ item.product }}
            </VChip>
            </template>
        </VDataTable>
        </VCard>
    </div>
    </template>

    <script setup lang="ts">
    import { ref } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

    interface ProductData {
    id: number
    product: string
    description: string
    }

    // Data products - readonly (view only)
    const products = ref<ProductData[]>([
    {
        id: 1,
        product: 'FLPP',
        description: 'Fasilitas Likuiditas Penjaminan Pemilikan'
    },
    {
        id: 2,
        product: 'Griya Nusantara',
        description: 'Program pembiayaan perumahan untuk masyarakat'
    }
    ])

    // Function untuk mendapatkan style chip berdasarkan product
    function getProductChipStyle(product: string) {
    if (product === 'FLPP') {
        return {
        backgroundColor: '#6abd4b',
        color: 'white'
        }
    } else if (product === 'Griya Nusantara') {
        return {
        backgroundColor: '#7921eb',
        color: 'white'
        }
    }
    return {}
    }
    </script>

    <style scoped>
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

    /* Hapus footer styling */
    :deep(.v-data-table-footer) {
    display: none !important;
    }
    </style>
    ```
