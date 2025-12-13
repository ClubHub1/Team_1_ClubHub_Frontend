// src/composables/feathers.ts
import { api } from '../backendAPI'

// Provides access to Feathers Client(s)
export function useFeathers() {
  return { api }
}