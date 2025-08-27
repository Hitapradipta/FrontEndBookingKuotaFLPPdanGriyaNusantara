<script setup lang="ts">
const searchQuery = ref('')

// Data untuk card dashboard
const dashboardCards = [
  {
    title: 'Pengajuan Kuota',
    icon: { icon: 'tabler-file-text' },
    color: 'red',
    bgColor: 'bg-red-500',
    headerColor: 'bg-red-700',
    description: 'Ajukan kuota FLPP',
    route: 'quota-quota-submission'
  },
  {
    title: 'Kuota',
    icon: { icon: 'tabler-clock' },
    color: 'green',
    bgColor: 'bg-green-500',
    headerColor: 'bg-green-700',
    description: 'Cek Kuota FLPP',
    route: 'quota-kuota'
  },
  {
    title: 'Status Pengajuan',
    icon: { icon: 'tabler-cash' },
    color: 'purple',
    bgColor: 'bg-purple-500',
    headerColor: 'bg-purple-700',
    description: 'Cek Status Pengajuan Kuota',
    route: 'quota-submission-status'
  },
  {
    title: 'Jadwal Angsuran',
    icon: { icon: 'tabler-calendar' },
    color: 'orange',
    bgColor: 'bg-orange-500',
    headerColor: 'bg-orange-700',
    description: 'Lihat Jadwal Angsuran',
    route: 'quota-jadwal-angsuran'
  },
  {
    title: 'Kuota Mitra',
    icon: { icon: 'tabler-folder' },
    color: 'teal',
    bgColor: 'bg-teal-500',
    headerColor: 'bg-teal-700',
    description: 'Kelola Kuota Mitra',
    route: 'quota-kuota-mitra'
  }
]

const router = useRouter()

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<template>
  <VCard class="overflow-visible">
    <div class="w-100 sticky-header">
      <div class="d-flex align-center gap-4 flex-wrap bg-background pa-3">
        <VCardText class="py-2 position-relative">
          <div
            class="d-flex flex-column gap-y-4 mx-auto"
            :class="$vuetify.display.mdAndUp ? 'w-50' : $vuetify.display.xs ? 'w-100' : 'w-75'"
          >
            <h4
              class="text-h5 text-center text-wrap mx-auto"
              :class="$vuetify.display.mdAndUp ? 'w-75' : 'w-100'"
            >
              Booking Kuota <span class="text-primary font-weight-bold"> All in one place.</span>
            </h4>
          </div>
        </VCardText>
      </div>
    </div>

    <!-- Dashboard Cards Grid -->
    <VCardText class="pa-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(card, index) in dashboardCards"
          :key="index"
          class="cursor-pointer"
          @click="navigateTo(card.route)"
        >
          <VCard
            :class="`${card.bgColor} hover:opacity-90 transition duration-200`"
            elevation="2"
          >
            <VCardItem :class="`${card.headerColor} text-white`">
              <template #prepend>
                <VIcon :icon="card.icon.icon" size="24" />
              </template>
              <VCardTitle class="text-white text-subtitle-1 font-weight-medium d-flex align-center">
                {{ card.title }}
              </VCardTitle>
            </VCardItem>
            <VCardText class="pa-4 text-center">
              <p class="text-body-1 font-weight-medium">
                {{ card.description }}
              </p>
            </VCardText>
          </VCard>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.sticky-header {
  position: sticky;
  z-index: 9;
  inset-block-end: 0;
  inset-block-start: 4rem;
  transition: all 0.3s ease-in-out;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Warna Header Card */
.bg-red-700 {
  background-color: #e53935 !important; /* Merah terang */
}

.bg-green-700 {
  background-color: #4caf50 !important; /* Hijau terang */
}

.bg-purple-700 {
  background-color: #673ab7 !important; /* Ungu terang */
}

.bg-orange-700 {
  background-color: #ff9800 !important; /* Orange terang */
}

.bg-teal-700 {
  background-color: #00bcd4 !important; /* Biru muda terang */
}

/* Hover Effect */
.hover:opacity-90:hover {
  opacity: 0.9;
}

/* Font Weight */
.font-weight-medium {
  font-weight: 500;
}

/* Icon Padding */
.v-icon {
  margin-right: 8px;
}
</style>
