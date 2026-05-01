import { api } from './api'

interface UploadResponse {
  filename: string
  originalName: string
  size: number
  mimeType: string
  path: string
}

export interface ProfilePhotoCropSettings {
  offsetX: number
  offsetY: number
  outputSize?: number
  previewSize: number
  zoom: number
}

const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(imageUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl)
      reject(new Error('Unable to load selected image. Please choose a different photo.'))
    }

    image.src = imageUrl
  })
}

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Unable to prepare cropped profile photo.'))
      }
    }, type, quality)
  })
}

export const cropAndResizeProfilePhoto = async (
  file: File,
  crop: ProfilePhotoCropSettings,
): Promise<File> => {
  const image = await loadImage(file)
  const outputSize = crop.outputSize ?? 512
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Image editing is not supported in this browser.')
  }

  canvas.width = outputSize
  canvas.height = outputSize

  const baseScale = Math.max(crop.previewSize / image.naturalWidth, crop.previewSize / image.naturalHeight)
  const outputRatio = outputSize / crop.previewSize

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, outputSize, outputSize)
  context.translate(outputSize / 2 + crop.offsetX * outputRatio, outputSize / 2 + crop.offsetY * outputRatio)
  context.scale(baseScale * crop.zoom * outputRatio, baseScale * crop.zoom * outputRatio)
  context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)

  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.9)
  const originalName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${originalName || 'profile-photo'}-cropped.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

export const uploadProfilePhoto = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await api.post('/upload', formData)
    return response.data
  } catch (error) {
    console.error('Profile photo upload failed:', error)
    throw error
  }
}
