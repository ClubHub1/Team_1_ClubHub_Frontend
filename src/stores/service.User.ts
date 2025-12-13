import { defineStore } from 'pinia'
import { PiniaService } from 'feathers-pinia'

export const useUserStore = defineStore('User', () => {
  const { api } = useFeathers()
  const auth = useAuth({ api, servicePath: 'User' })
  return {...auth}
})

if (import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}