<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { feathersClient } from '../backendAPI'
import useClubStore from '../stores/clubStore'

const clubStore = useClubStore()

const view = ref<'list' | 'add'>('list')
const memberList = ref<{
    memberFName: string
    memberLName: string
    memberEmail: string
    membershipID: number
    memberRole: string
}[]>([])

async function loadMembers() {
    const memberRes = await (feathersClient.service('ClubMembership') as any).find({
        query: {
            clubid: clubStore.id,
            $sort: { userid: -1 }
        }
    }).catch((err: any) => {
        console.error('Failed to load members:', err)
    })

    if (!memberRes) return
    const memberArray = memberRes.data
    const userIds = memberArray.map((m: any) => m.userid)

    const usersRes = await (feathersClient.service('User') as any).find({
        query: {
            $sort: { id: -1 },
            id: { $in: userIds }
        }
    }).catch((err: any) => {
        console.error('Failed to load users:', err)
    })

    if (!usersRes) return

    const userData = usersRes.data
    memberList.value = []
    for (let i = 0; i < userData.length; i++) {
        memberList.value.push({
            memberFName: userData[i].first_name,
            memberLName: userData[i].last_name,
            memberEmail: userData[i].email,
            membershipID: memberArray[i].id,
            memberRole: memberArray[i].role
        })
    }
}

function manageMember(id: number) {
    console.log('MANAGING MEMBER WITH MEMBERSHIP ID:', id)
}

function cellPropHandler({ item, column }: any) {
    if (item.memberRole === 'President' && column.title === 'Role') {
        return { class: 'bg-error rounded px-2 py-1' }
    }
    return null
}

const role = ref('Select Role')
const email = ref('')
const error = ref('')
const loading = ref(false)
const valid = ref(false)

const emailRules = [
    (value: string) => {
        if (value) return true
        return 'E-mail is required.'
    },
    (value: string) => {
        if (/^[a-z0-9._%+-]+@unr\.edu$/i.test(value)) return true
        return 'E-mail must be valid and school issued ("@unr").'
    },
]

const roleColors: Record<string, string> = {
    'Select Role': 'primary',
    'President': 'purple-darken-3',
    'Vice President':'cyan-darken-1',
    'Treasurer': 'amber-lighten-1',
    'Secretary': 'green-darken-3',
    'Member': 'blue-grey-lighten-1',
}

async function addMember() {
    if (!valid.value) return

    error.value   = ''
    loading.value = true

    try {
        if (role.value !== 'Member') {
            const res = await (feathersClient.service('ClubMembership') as any).find({
                query: { clubid: clubStore.id, role: role.value }
            })
            if (res.data.length >= 1) {
                error.value   = 'Role is already taken in this organization!'
                loading.value = false
                return
            }
        }

        const alreadyMember = memberList.value.some(m => m.memberEmail === email.value)
        if (alreadyMember) {
            error.value   = 'The user with this email is already a member!'
            loading.value = false
            return
        }
        const res = await (feathersClient.service('User') as any).find({
            query: { $select: ['id', 'email'], email: email.value }
        })
        if (res.data.length !== 1) {
            error.value   = 'User does not exist in the system — check their email.'
            loading.value = false
            return
        }
        await (feathersClient.service('ClubMembership') as any).create({
            clubid:    clubStore.id,
            userid:    res.data[0].id,
            role:      role.value,
            is_active: true,
            dues_paid: false
        })

        await loadMembers()
        email.value = ''
        role.value  = 'Select Role'
        view.value  = 'list'
    } catch (err: any) {
        error.value = err.message ?? 'Failed to add member.'
        console.error(err)
    } finally {
        loading.value = false
    }
}

onMounted(loadMembers)
</script>

<template>
    <div v-if="view === 'list'">
        <v-card>
            <v-card-title>Members</v-card-title>
            <v-card-text>
                <v-data-table
                    :cell-props="cellPropHandler"
                    :items="memberList"
                    :headers="[
                        { title: 'First Name', key: 'memberFName' },
                        { title: 'Last Name',  key: 'memberLName' },
                        { title: 'Role', key: 'memberRole'  },
                        { title: 'Email', key: 'memberEmail' },
                        { title: 'Actions', key: 'actions'     }
                    ]"
                >
                    <template #item.actions="{ item }">
                        <v-btn
                            icon="mdi-cog"
                            height="30"
                            width="30"
                            class="ml-3"
                            @click="manageMember(item.membershipID)"
                        />
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <v-row justify="center" class="mt-10">
            <v-btn color="primary" @click="view = 'add'">
                Add Members
            </v-btn>
        </v-row>
    </div>

    <div v-else>
        <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
                Add Member
                <v-btn size="small" variant="text" prepend-icon="mdi-arrow-left" @click="view = 'list'">
                    Back to Members
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-form v-model="valid" @submit.prevent="addMember">

                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                        class="mb-2"
                    />

                    <div class="mb-6">
                        <p class="text-body-2 text-medium-emphasis mb-2">Role</p>
                        <v-menu>
                            <template #activator="{ props }">
                                <v-btn v-bind="props" :color="roleColors[role] ?? 'primary'">
                                    {{ role }}
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="role = 'President'"      :active="role === 'President'">President</v-list-item>
                                <v-list-item @click="role = 'Vice President'" :active="role === 'Vice President'">Vice President</v-list-item>
                                <v-list-item @click="role = 'Treasurer'"      :active="role === 'Treasurer'">Treasurer</v-list-item>
                                <v-list-item @click="role = 'Secretary'"      :active="role === 'Secretary'">Secretary</v-list-item>
                                <v-list-item @click="role = 'Member'"         :active="role === 'Member'">Member</v-list-item>
                            </v-list>
                        </v-menu>
                    </div>

                    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                        {{ error }}
                    </v-alert>

                    <v-row class="mt-2">
                        <v-col>
                            <v-btn type="submit" color="primary" :loading="loading">
                                Add Member
                            </v-btn>
                        </v-col>
                    </v-row>

                </v-form>
            </v-card-text>
        </v-card>
    </div>

</template>