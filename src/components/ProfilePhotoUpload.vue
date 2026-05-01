<script setup lang="ts">
import { computed, ref } from 'vue'
import { cropAndResizeProfilePhoto, uploadProfilePhoto } from '../services/profileUpload'

const emit = defineEmits<{
  'photo-uploaded': [photoUrl: string]
}>()

const file = ref<File | null>(null)
const preview = ref<string>('')
const imageWidth = ref(0)
const imageHeight = ref(0)
const zoom = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const startOffsetX = ref(0)
const startOffsetY = ref(0)
const loading = ref(false)
const error = ref('')

const previewSize = 280
const outputSize = 512

const baseImageScale = computed(() => {
  if (!imageWidth.value || !imageHeight.value) return 1
  return Math.max(previewSize / imageWidth.value, previewSize / imageHeight.value)
})

const imageStyle = computed(() => ({
  width: `${imageWidth.value * baseImageScale.value}px`,
  height: `${imageHeight.value * baseImageScale.value}px`,
  transform: `translate(-50%, -50%) translate(${offsetX.value}px, ${offsetY.value}px) scale(${zoom.value})`,
}))

const clampOffsets = () => {
  if (!imageWidth.value || !imageHeight.value) return

  const displayWidth = imageWidth.value * baseImageScale.value * zoom.value
  const displayHeight = imageHeight.value * baseImageScale.value * zoom.value
  const maxX = Math.max(0, (displayWidth - previewSize) / 2)
  const maxY = Math.max(0, (displayHeight - previewSize) / 2)

  offsetX.value = Math.min(maxX, Math.max(-maxX, offsetX.value))
  offsetY.value = Math.min(maxY, Math.max(-maxY, offsetY.value))
}

const resetCrop = () => {
  zoom.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

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
  resetCrop()

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target?.result as string
  }
  reader.readAsDataURL(selectedFile)
}

const handlePreviewLoad = (event: Event) => {
  const image = event.target as HTMLImageElement
  imageWidth.value = image.naturalWidth
  imageHeight.value = image.naturalHeight
  clampOffsets()
}

const startDrag = (event: PointerEvent) => {
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartY.value = event.clientY
  startOffsetX.value = offsetX.value
  startOffsetY.value = offsetY.value
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

const dragImage = (event: PointerEvent) => {
  if (!isDragging.value) return

  offsetX.value = startOffsetX.value + event.clientX - dragStartX.value
  offsetY.value = startOffsetY.value + event.clientY - dragStartY.value
  clampOffsets()
}

const stopDrag = (event: PointerEvent) => {
  if (!isDragging.value) return

  isDragging.value = false
  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
}

const uploadPhoto = async () => {
  if (!file.value) {
    error.value = 'Please select a file'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const croppedFile = await cropAndResizeProfilePhoto(file.value, {
      offsetX: offsetX.value,
      offsetY: offsetY.value,
      outputSize,
      previewSize,
      zoom: zoom.value,
    })
    const response = await uploadProfilePhoto(croppedFile)
    emit('photo-uploaded', response.path)
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
  imageWidth.value = 0
  imageHeight.value = 0
  resetCrop()
  error.value = ''
}
</script>

<template>
  <div class="profile-photo-upload">
    <v-card class="pa-4">
      <v-card-title>Profile Photo</v-card-title>

      <div v-if="!preview" class="upload-area">
        <v-file-input
          label="Select profile photo"
          accept="image/*"
          @change="handleFileSelect"
          prepend-icon="mdi-camera"
          show-size
        />
      </div>

      <div v-else class="preview-area">
        <div
          class="crop-frame"
          :class="{ dragging: isDragging }"
          @pointerdown="startDrag"
          @pointermove="dragImage"
          @pointerup="stopDrag"
          @pointercancel="stopDrag"
          @pointerleave="stopDrag"
        >
          <img
            :src="preview"
            :style="imageStyle"
            alt="Profile photo preview"
            class="photo-preview"
            draggable="false"
            @load="handlePreviewLoad"
          />
          <div class="crop-guide" />
        </div>

        <div class="crop-controls">
          <v-slider
            v-model="zoom"
            label="Zoom"
            min="1"
            max="3"
            step="0.01"
            prepend-icon="mdi-magnify-minus-outline"
            append-icon="mdi-magnify-plus-outline"
            hide-details
            @update:model-value="clampOffsets"
          />
          <v-btn @click="resetCrop" variant="text" size="small" prepend-icon="mdi-refresh">
            Reset Crop
          </v-btn>
        </div>

        <div class="preview-actions">
          <v-btn @click="clearFile" variant="outlined" size="small">
            Clear
          </v-btn>
          <v-btn
            @click="uploadPhoto"
            :loading="loading"
            color="primary"
            size="small"
          >
            Upload Photo
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
.profile-photo-upload {
  margin: 16px 0;
}

.upload-area {
  padding: 16px 0;
}

.preview-area {
  text-align: center;
}

.crop-frame {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 16px auto;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
  border-radius: 8px;
  background: rgba(var(--v-theme-surface-variant), 0.35);
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.crop-frame.dragging {
  cursor: grabbing;
}

.photo-preview {
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: none;
  max-height: none;
  transform-origin: center;
  user-select: none;
  will-change: transform;
}

.crop-guide {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

.crop-guide::before,
.crop-guide::after {
  position: absolute;
  content: '';
  background: rgba(255, 255, 255, 0.55);
}

.crop-guide::before {
  top: 33.333%;
  bottom: 33.333%;
  left: 0;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.55);
  border-bottom: 1px solid rgba(255, 255, 255, 0.55);
  background: transparent;
}

.crop-guide::after {
  top: 0;
  bottom: 0;
  left: 33.333%;
  width: 33.333%;
  border-left: 1px solid rgba(255, 255, 255, 0.55);
  border-right: 1px solid rgba(255, 255, 255, 0.55);
  background: transparent;
}

.crop-controls {
  max-width: 360px;
  margin: 0 auto;
}

.preview-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
}
</style>
