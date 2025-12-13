// store/store.pinia.ts
import { createPinia } from 'pinia'
import { create } from 'feathers-pinia'
import { api } from '../backendAPI'

export const pinia = createPinia()

export const { defineStore, BaseModel } = setupFeathersPinia({
  clients: { api },
  idField: 'id',
})