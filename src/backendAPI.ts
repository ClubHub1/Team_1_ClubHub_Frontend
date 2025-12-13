// src/feathers.ts
import { createClient } from 'CHBackend'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import { pinia } from './modules/pinia'


const host = 'http://localhost:3030'
const socket = io(host, { transports: ['websocket'] })

const feathersClient = createClient(socketio(socket), { storage: window.localStorage })

// src/feathers.ts
export const api = createPiniaClient(feathersClient, {
  pinia,
  idField: '_id',
  // optional
  ssr: false,
  whitelist: [],
  paramsForServer: [],
  skipGetIfExists: true,
  customSiftOperators: {},
  setupInstance(data) {
    return data
  },
  customizeStore(defaultStore) {
    return {}
  },
  services: {},
})