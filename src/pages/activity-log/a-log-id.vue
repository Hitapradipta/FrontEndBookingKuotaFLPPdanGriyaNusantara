<template>
<div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-white">Detail Log Activity</h1>
    <VBtn
        color="error"
        variant="outlined"
        @click="goBack"
    >
        <VIcon icon="tabler-corner-down-left" class="mr-2" />
        Kembali
</VBtn>
    </div>

    <!-- Content -->
    <VCard>
    <VCardItem>
        <VCardTitle>ID Pengajuan: {{ $route.params.id }}</VCardTitle>
    </VCardItem>
    <VCardText>
        <p>Halaman ini menampilkan detail log activity untuk pengajuan dengan ID: {{ $route.params.id }}</p>
    </VCardText>
    </VCard>
</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

function goBack() {
router.go(-1)
}
</script>
