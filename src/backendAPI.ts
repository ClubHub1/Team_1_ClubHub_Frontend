// CHBackend is not available in Codespaces - using mock client
// import { createClient } from 'CHBackend'

const makeService = () => ({
  find: async () => ({ data: [] }),
  create: async (data: any) => data,
  patch: async (_id: any, data: any) => data,
  remove: async () => ({}),
  _create: async (data: any) => data,
})

export const feathersClient = {
  service: (_name: string) => makeService()
}

// Required by feathersCompose.ts
export const api = feathersClient