<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'

import type { UserProperties } from '@/views/user-management/user/types'

interface Props {
  isDrawerOpen: boolean
  userData?: UserProperties
}

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
  (e: 'submit', value: UserProperties): void
}

interface SelectOption {
  title: string
  value: string
}

const props = withDefaults(defineProps<Props>(), {
  userData: () => ({
    id: 0,
    username: '',
    full_name: '',
    email: '',
    phone: '',
    id_msso: '',
    id_roles: '',
  }),
})

const emit = defineEmits<Emit>()

// 👉 List Option
const listParent = ref<SelectOption[]>([])
const listRoles = ref<SelectOption[]>([])

const userData = ref<UserProperties>(structuredClone(toRaw(props.userData)))

const isFormValid = ref(false)
const refForm = ref<VForm>()
const loading = ref(false)
const searchRoles = ref()
const searchParent = ref()

// 👉 Fetching divisi
const fetchParent = async (query: string, limit: number) => {
  loading.value = true

  const res = await $api(`admin/master/getallmasterso?page=1&limit=${limit}&orderby=id_msso&term=${query}`, {
    method: 'GET',
    onResponseError({ response }) {
      console.log(response)
    },
  })

  const data = res.data.data

  listParent.value = []
  data.forEach((value: any, key: any) => {
    listParent.value[key] = { title: value.name, value: value.id_msso }
  })
  loading.value = false

  console.log(listParent.value)
}

const fetchRoles = async (query: string) => {
  loading.value = true

  const res = await $api(`/admin/master/alluserroles?limit=9999&page=1&sortBy=ASC&orderBy=id_roles&term=${query}`, {
    method: 'GET',
    onResponseError({ response }) {
      console.log(response)
    },
  })

  const data = res.data.data

  listRoles.value = []
  data.forEach((value: any, key: any) => {
    listRoles.value[key] = { title: value.role_name, value: value.id_roles }
  })

  loading.value = false
}

watch(searchRoles, query => {
  query && query !== userData.value?.id_msso && fetchParent(query, 100)
})

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
})

onMounted(() => {
  fetchParent('', 100)
  fetchRoles('')
})

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('submit', userData.value)
      emit('update:isDrawerOpen', false)
      fetchParent('', 100)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })
}

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Add User"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppTextField
                  v-model="userData.full_name"
                  :rules="[requiredValidator]"
                  label="Full Name"
                  placeholder="Full Name"
                />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="12">
                <AppTextField
                  v-model="userData.username"
                  :rules="[requiredValidator]"
                  label="Username"
                  placeholder="Username"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="userData.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  placeholder="email@email.com"
                />
              </VCol>

              <!-- 👉 Country -->
              <VCol cols="12">
                <AppTextField
                  v-model="userData.phone"
                  label="Phone"
                  placeholder="Phone"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Parent Group -->
              <VCol cols="12">
                <AppAutocomplete
                  v-model="userData.id_msso"
                  v-model:search-input="searchParent"
                  :rules="[requiredValidator]"
                  :loading="loading"
                  :items="listParent"
                  label="Select Parent"
                  placeholder="Select Parent"
                  hide-no-data
                  hide-selected
                />
              </VCol>

              <VCol cols="12">
                <AppAutocomplete
                  v-model="userData.id_roles"
                  v-model:search-input="searchRoles"
                  :loading="loading"
                  :rules="[requiredValidator]"
                  :items="listRoles"
                  label="Select Role"
                  placeholder="Select Role"
                  hide-no-data
                  hide-selected
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  variant="outlined"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
