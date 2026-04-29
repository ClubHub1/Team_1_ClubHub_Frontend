<script setup lang="ts">
import { ref } from 'vue'
import { uploadClubLogo } from '../services/logoUpload'

interface Props {
  clubId: number | null
}

const props = withDefaults(defineProps<Props>(), {
  clubId: null,
})

const emit = defineEmits<{
  'logo-uploaded': [logoUrl: string]
}>()

const file = ref<File | null>(null)
const preview = ref<string>('')
const loading = ref(false)
const error = ref('')

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]

  if (!selectedFile) return

  // Validate file type
  if (!selectedFile.type.startsWith('image/')) {
    error.value = 'Please select an image file'
    return
  }

  // Validate file size (max 5MB)
  if (selectedFile.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB'
    return
  }

  file.value = selectedFile
  error.value = ''

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target?.result as string
  }
  reader.readAsDataURL(selectedFile)
}

const uploadLogo = async () => {
  if (!file.value || !props.clubId) {
    error.value = 'Please select a file and ensure club is created'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await uploadClubLogo(props.clubId, file.value)
    emit('logo-uploaded', response.logo_url)
    file.value = null
    preview.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Upload failed'
  } finally {
    loading.value = false
  }
}

const clearFile = () => {
  file.value = null
  preview.value = ''
  error.value = ''
}
</script>

<template>
  <div class="logo-upload">
    <v-card class="pa-4">
      <v-card-title>Club Logo</v-card-title>

      <div v-if="!preview" class="upload-area">
        <v-file-input
          label="Select logo image"
          accept="image/*"
          @change="handleFileSelect"
          prepend-icon="mdi-camera"
          show-size
        ></v-file-input>
      </div>

      <div v-else class="preview-area">
        <img :src="preview" :alt="'Logo preview'" class="logo-preview" />
        <div class="preview-actions">
          <v-btn @click="clearFile" variant="outlined" size="small">
            Clear
          </v-btn>
          <v-btn
            @click="uploadLogo"
            :loading="loading"
            color="primary"
            size="small"
          >
            Upload Logo
          </v-btn>
        </div>
      </div>

      <v-alert v-if="error" type="error" class="mt-3">
        {{ error }}
      </v-alert>
    </v-card>
  </div>
</template>

<style scoped>
.logo-upload {
  margin: 16px 0;
}

.upload-area {
  padding: 16px 0;
}

.preview-area {
  text-align: center;
}

.logo-preview {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin: 16px 0;
  object-fit: contain;
}

.preview-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
}
</style>
