<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { feathersClient } from '../backendAPI'
import useClubStore from '../stores/clubStore';
import useUserStore from '../stores/user';
import useMemberStore from '../stores/memberStore';

const clubStore = useClubStore()
const userStore = useUserStore()
const memberStore = useMemberStore()

const officerRoles = ['president', 'vice_pres', 'treasurer', 'secretary', 'officer', 'advisor', 'President', 'Vice President', 'Treasurer', 'Secretary', 'Advisor']
const isOfficer = computed(() => officerRoles.map(r => r.toLowerCase()).includes(memberStore.role.toLowerCase()))

interface clubEvent { id: number; name: string; code: string }
const events = ref<clubEvent[]>([])
const selectedEvent = ref<clubEvent | null>(null)

async function loadEvents(){
    try{
        const res = await (feathersClient.service('Event') as any).find({
            query: { club: clubStore.id, $limit: 50, $select: ['id', 'name', 'code']}
        })
        events.value = res.data
    }
    catch (e){
        console.error('Failed to load events', e)
    }
}

//member view
const enteredCode = ref('')
const codeLoading = ref(false)
const codeError = ref('')
const codeSuccess = ref(false)

async function submitCode(){
    if(!enteredCode.value.trim()) return
    codeLoading.value = true
    codeError.value = ''
    codeSuccess.value = false

    try{
        const res = await(feathersClient.service('Event') as any).find({
            query: { club: clubStore.id, code: String(enteredCode).trim(), $limit: 1}
        })
        if(!res.data.length){
            codeError.value = 'Invalid code. please check with your officer and try again.'
            return
        }
        const event=res.data[0]

        await(feathersClient.service('Attendance') as any).create({
            event: event.id,
            user: userStore.id,
            status: 'present',
            time: new Date().toISOString()
        })
        codeSuccess.value = true
        enteredCode.value = ''
    }
    catch (err: any){
        codeError.value = err.message ?? 'Something went wrong. Please try again.'
    }
    finally{
        codeLoading.value = false
    }
}

//officer view - generating a code
const generatedCode = ref('')
const generateLoading = ref(false)
const generateError = ref('')
const codeCopied = ref(false)

function makeCode(){
    return Array.from({length:4}, () => Math.floor(Math.random()*10)).join('')
}

async function generateCode(){
    if(!selectedEvent.value) return
    generateLoading.value = true
    generateError.value = ''
    generatedCode.value = ''

    try{
        const code = makeCode()
        await(feathersClient.service('Event') as any).patch(selectedEvent.value.id,{code})
        generatedCode.value = code
        selectedEvent.value.code = code
    }
    catch (err: any){
        generateError.value = err.message ?? 'Failed to generate code.'
    }
    finally{
        generateLoading.value = false
    }
}

function copyCode(){
    if(!generatedCode.value) return
    navigator.clipboard.writeText(generatedCode.value)
    codeCopied.value = true
    setTimeout(() => {codeCopied.value = false}, 2000)
}

//officer view - add manually
const manualDialog = ref(false)
const manualEmail = ref('')
const manualLoading = ref(false)
const manualError = ref('')
const manualSuccess = ref(false)
const manualFormRef = ref()

async function addManually(){
    if(!selectedEvent.value) return
    manualLoading.value = true
    manualError.value = ''
    manualSuccess.value = false

    try{
        const res = await(feathersClient.service('User') as any).find({
            query: {email: manualEmail.value.trim(), $limit:1}
        })
        if(!res.data.length){
            manualError.value = 'No user found with that email address.'
            return
        }
        const user = res.data[0]

        await(feathersClient.service('Attendance') as any).create({
            event: selectedEvent.value.id,
            user: user.id,
            status: 'present',
            time: new Date().toISOString()
        })
        manualSuccess.value = true
        manualEmail.value = ''
    }
    catch (err: any){
        manualError.value = err.message ?? 'Failed to add attendance record.'
    }
    finally{
        manualLoading.value = false
    }
}

function closeManualDialog(){
    manualDialog.value = false
    manualError.value = ''
    manualSuccess.value = false
    manualEmail.value = ''
}

onMounted(loadEvents)
</script>

<template>
    <v-card>
    <v-card-title>Attendance</v-card-title>
        <v-card-text>

            <!-- ── Member view -->
            <template v-if="!isOfficer">
    
                <p class="text-body-1 text-medium-emphasis mb-6">
                    Enter the attendance code your officer shared with you.
                </p>
                <v-alert v-if="codeSuccess" type="success" variant="tonal" class="mb-4" closable @click:close="codeSuccess = false">
                    Attendance recorded successfully!
                </v-alert>
                <v-alert v-if="codeError" type="error" variant="tonal" class="mb-4">
                    {{ codeError }}
                </v-alert>
        
                <v-form @submit.prevent="submitCode">
                    <v-text-field
                        v-model="enteredCode"
                        label="Attendance Code"
                        placeholder="e.g. 1234"
                        maxlength="4"
                        counter="4"
                        type="number"
                        style="max-width: 300px"
                        :disabled="codeLoading"
                    />
                    <v-row class="mt-2">
                        <v-col>
                            <v-btn
                                type="submit"
                                color="primary"
                                :loading="codeLoading"
                                :disabled="String(enteredCode).length < 4"
                            >Submit Code</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
    
            </template>
    
            <!-- ── Officer view ─ -->
            <template v-else>
    
                <!-- Event selector -->
                <v-select
                    v-model="selectedEvent"
                    :items="events"
                    item-title="name"
                    item-value="id"
                    return-object
                    label="Choose Event"
                    style="max-width: 400px"
                    class="mb-6"
                    clearable
                />
        
                <template v-if="selectedEvent">
        
                    <!-- Generate code section -->
                    <div class="mb-8">
                        <p class="text-body-1 font-weight-bold mb-1">Attendance Code</p>
                        <p class="text-body-2 text-medium-emphasis mb-4">
                            Generate a 4-character code for members to enter on their device.
                        </p>
        
                        <v-alert v-if="generateError" type="error" variant="tonal" class="mb-4">
                        {{ generateError }}
                        </v-alert>
        
                    <!-- Show existing code if one exists, otherwise prompt to generate -->
                        <div v-if="generatedCode || selectedEvent.code" class="d-flex align-center ga-3 mb-4">
                        <v-chip
                            size="x-large"
                            color="primary"
                            label
                            class="text-h5 font-weight-bold px-6"
                        >
                            {{ generatedCode || selectedEvent.code }}
                        </v-chip>
                        <v-btn
                            :icon="codeCopied ? 'mdi-check' : 'mdi-content-copy'"
                            variant="tonal"
                            :color="codeCopied ? 'success' : 'primary'"
                            size="small"
                            @click="copyCode"
                        />
                        </div>
        
                        <v-btn
                            color="primary"
                            variant="outlined"
                            prepend-icon="mdi-refresh"
                            :loading="generateLoading"
                            @click="generateCode"
                        >
                            {{ generatedCode || selectedEvent.code ? 'Regenerate Code' : 'Generate Code' }}
                        </v-btn>
                    </div>
        
                    <v-divider class="mb-6" />
                    <!-- Manual add section -->
                    <div>
                        <p class="text-body-1 font-weight-bold mb-1">Add Member Manually</p>
                        <p class="text-body-2 text-medium-emphasis mb-4">
                        Look up a member by email and mark them present directly.
                        </p>
                        <v-btn
                            color="primary"
                            variant="outlined"
                            prepend-icon="mdi-account-plus"
                            @click="manualDialog = true"
                        >
                        Add Member
                        </v-btn>
                    </div>
        
                </template>
        
                <!-- No event selected nudge -->
                <v-alert v-else type="info" variant="tonal" class="mt-2" style="max-width: 400px">
                Select an event above to manage attendance.
                </v-alert>
        
            </template>
    
        </v-card-text>
    </v-card>
 
  <!-- ── Manual add dialog ──-->
    <v-dialog v-model="manualDialog" max-width="440" @after-leave="closeManualDialog">
        <v-card rounded="lg">
                <v-card-title class="pt-6 px-6">Add Member Manually</v-card-title>
                <v-card-subtitle class="px-6 pb-2">
                    Recording attendance for: <strong>{{ selectedEvent?.name }}</strong>
                </v-card-subtitle>
    
            <v-card-text class="px-6">
                <v-alert v-if="manualSuccess" type="success" variant="tonal" class="mb-4" closable @click:close="manualSuccess = false">
                    Attendance recorded successfully!
                </v-alert>
                <v-alert v-if="manualError" type="error" variant="tonal" class="mb-4">
                    {{ manualError }}
                </v-alert>
        
                <v-form ref="manualFormRef" @submit.prevent="addManually">
                    <v-text-field
                        v-model="manualEmail"
                        label="Member Email"
                        type="email"
                        :rules="[(v: string) => !!v || 'Email is required.']"
                        :disabled="manualLoading"
                    />
                </v-form>
            </v-card-text>
    
            <v-card-actions class="px-6 pb-6 ga-2">
                <v-btn variant="text" @click="closeManualDialog">Cancel</v-btn>
                <v-spacer />
                <v-btn
                color="primary"
                :loading="manualLoading"
                :disabled="!manualEmail.trim()"
                @click="addManually"
                >Add</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>