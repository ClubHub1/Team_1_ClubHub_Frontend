import { defineStore } from 'pinia'
import { PiniaService } from 'feathers-pinia'
import { acceptHMRUpdate } from 'pinia'
import { pinia } from '../modules/pinia'
import { useServiceStore } from 'feathers-pinia'

const api = useFeathers()

export const useUserStore = defineStore('User', () => {
  

})

if (import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}