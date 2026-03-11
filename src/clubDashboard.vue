<script setup lang="ts">
    import { ref, reactive, computed, VueElement } from 'vue'
    import { useAuthStore } from './stores/auth'
    import useClubStore from './stores/clubStore'
    import { feathersClient } from './backendAPI'
    import useMemberStore from './stores/memberStore'
    import useUserStore from './stores/user'

    const auth = useAuthStore()
    const clubStore = useClubStore()
    const memberStore = useMemberStore()
    const userStore = useUserStore()

    const USERROLE = ''
    const role = ref('Select Role')
    const email = ref('')
    const error = ref('')

    const loading = ref(false)
    const valid = ref(false)

    const memberList = []

    async function setPermissions(){
        const res = await(feathersClient.service("ClubMembership").find({
            query:{
                $select:['role', 'id'],
                userid: userStore.id,
                clubid: clubStore.id
            }
        })).catch(err =>{
            console.log('SERVER THREW ERROR RETRIEVING MEMBERSHIP ENTRY: ', err)
        })

        //console.log(res)

        if(res){
            const memberInfo = res.data
            console.log('CURRENT MEMBERINFO: ', memberInfo[0].role, ' ', memberInfo[0].id)

            memberStore.setRole(memberInfo[0].role)
            memberStore.setId(memberInfo[0].id)
        }
        
        const memberRes = await(feathersClient.service("ClubMembership").find({
            query: {
                clubid: clubStore.id,
                $sort: {
                    userid: -1
                }
            }
        })).catch(err =>{
            error.value = err
            console.log(error)
        })

        const userIds = []

        
        if(memberRes){
            console.log(memberRes)
            const memberArray = memberRes.data
            for(const member of memberArray){
                userIds.push(member.userid)
            }

            console.log('USER IDS: ', userIds)

            const usersRes = await(feathersClient.service("User").find({
                query:{
                    $sort: {
                        id: -1
                    },
                    id: {
                        $in: userIds
                    }
                }
            })).catch(err=>{
                error.value = err
                console.log(error)
            })

            if(usersRes){
                console.log(usersRes)
                const userData = usersRes.data

                console.log(userData)

                for(let i = 0; i < userData.length; i++){
                    memberList.push({
                        memberFName: userData[i].first_name,
                        memberLName: userData[i].last_name,
                        memberEmail: userData[i].email,
                        membershipID: memberArray[i].id,
                        memberRole: memberArray[i].role
                    });
                }

                console.log(memberList)
            }

        }
        
        //console.log(memberInfo)


    }

    

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

    onMounted(setPermissions)

    const sections = [
        { id: 'dashboard', label: 'Club Dashboard', icon: 'mdi-view-dashboard-variant-outline', roles:['Advisor','President', 'Vice President', 'Treasurer', 'Secretary', 'Member']},
        { id: 'createEvent', label: 'Create Event', icon: 'mdi-calendar-plus', roles:['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary']},
        { id: 'createAnnouncement', label: 'Create Announcement', icon: 'mdi-bullhorn-outline', roles: ['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary']},
        { id: 'members', label: 'Members', icon: 'mdi-account-multiple', roles:['Advisor', 'President', 'Vice President', 'Treasurer', 'Secretary']},
        { id: 'finances', label: 'Finances', icon: 'mdi-cash-multiple', roles:['Advisor', 'President', 'Treasurer']},
        { id: 'settings', label: 'Settings', icon:'mdi-cog', roles:['Advisor', 'President']}
    ]

    const activeSections = computed(() => {
        console.log('AUTHENTICATED USER ROLE: ', memberStore.role)
        console.log(sections)
        return sections.filter(item => item.roles.includes(memberStore.role))
    });

    console.log(activeSections.value)

    const selected = ref('dashboard')

    const eventForm = reactive({ title: '', date: '', location: '', description: '' })
    const announcementForm = reactive({ title: '', message: '' })

    const members = ref([])

    const transactions = ref([
        { id: 1, date: '2026-02-01', description: 'Membership fees', amount: 200 },
        { id: 2, date: '2026-02-15', description: 'Poster printing', amount: -40 }
    ])

    const balance = computed(() => transactions.value.reduce((s, t) => s + t.amount, 0))

    function submitEvent() {
        // TODO: wire to backend API
        console.log('Create Event', { ...eventForm })
        Object.assign(eventForm, { title: '', date: '', location: '', description: '' })
    }

    function submitAnnouncement() {
        // TODO: wire to backend API
        console.log('Create Announcement', { ...announcementForm })
        Object.assign(announcementForm, { title: '', message: '' })
    }

    function addTransaction() {
        const id = transactions.value.length + 1
        transactions.value.push({ id, date: new Date().toISOString().slice(0, 10), description: 'New tx', amount: 0 })
    }

    function manageMember(id: number) {
        console.log('MANAGING MEMBER WITH MEMBERSHIP ID:', id)
    }



    async function addMember(){
        if (!valid.value) return

        error.value = ''
        loading.value = true

        if(role.value != 'Member'){
            const res = await(feathersClient.service('ClubMembership')).find({
                query: {
                    clubid: clubStore.id,
                    role: role.value
                }
            })
            console.log('MEMBERADD RES: ', res)
            if(res.data.length >= 1){
                error.value = 'Role is already taken in this organization!'
                loading.value = false;
                return
            } else {
                console.log("ROLE NOT TAKEN")
            }
        }

        for(const member of memberList){
            if(member.memberEmail == email.value){
                error.value = 'The user with this email is already a member!'
                loading.value = false;
                return
            } else {
                console.log("USER NOT A MEMBER")
            }
        }

        const res = await(feathersClient.service("User").find({
            query:{
                $select: ['id, email'],
                email: email.value,
            }
        }))
        if(res.data.length == 1){
            console.log(res.data[0])
        } else {
            console.log("User does not exist in the system- check their email")
        }

    }

    function cellPropHandler({item, column}){
        console.log(item, column)
        if (item.memberRole == 'President' && column.title == 'Role') {
            return { class: 'bg-error rounded px-2 py-1' }; // Using a built-in Vuetify background color class
        }
        return null;
    }

</script>

<template>
    <v-app>
        <v-navigation-drawer expand-on-hover permanent rail width="260" app>
            <v-list>

                <v-list-item v-for="s in activeSections" :key="s.id" :value="s.id" @click="selected = s.id" :active="selected === s.id" :prepend-icon="s.icon">
                    <v-list-item-title>{{ s.label }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="primary">
            <v-toolbar-title><span class="font-weight-bold">{{ clubStore.name }}</span> — Manage your organization</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <v-container class="pa-6">
                <div v-if="selected === 'createEvent'">
                    <v-card>
                        <v-card-title>Create Event</v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-text-field v-model="eventForm.title" label="Title" />
                                <v-text-field v-model="eventForm.date" label="Date" type="date" />
                                <v-text-field v-model="eventForm.location" label="Location" />
                                <v-textarea v-model="eventForm.description" label="Description" rows="4" />
                                <v-row class="mt-4">
                                    <v-col>
                                        <v-btn color="primary" @click="submitEvent">Create</v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </div>

                <div v-if="selected === 'createAnnouncement'" class="mt-6">
                    <v-card>
                        <v-card-title>Create Announcement</v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-text-field v-model="announcementForm.title" label="Title" />
                                <v-textarea v-model="announcementForm.message" label="Message" rows="4" />
                                <v-row class="mt-4">
                                    <v-col>
                                        <v-btn color="primary" @click="submitAnnouncement">Publish</v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </div>

                <div v-if="selected === 'members'" class="mt-6">
                    <v-card>
                        <v-card-title>Members</v-card-title>
                        <v-card-text>
                            <v-data-table :cell-props="cellPropHandler" :items="memberList" :headers="[{title:'First Name',key:'memberFName'},{title:'Last Name',key:'memberLName'},{title:'Role',key:'memberRole',},{title:'Email',key:'memberEmail'},{title:'Actions',key:'actions'}]">
                                <template #item.actions="{ item }">
                                    <v-btn class="ml-3" icon="mdi-cog" height="30" width="30" @click="manageMember(item.membershipID)"></v-btn>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                    <v-row justify="center" class="mt-15">
                        <v-btn color="primary" class="justify-center" @click="selected = 'memberAdd'">
                            Add Members
                        </v-btn>
                    </v-row>
                    
                </div>

                <div v-if="selected === 'memberAdd'" class="mt-6">
                    <v-form v-model="valid" class="mt-7" @submit.prevent="addMember">
              
                        <v-row>
                            <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            required
                            class="mr-6 mb-5"
                            />
                        </v-row>

                        <v-row>

                            <v-menu>
                                <template v-slot:activator="{props}"> 
                                    <v-btn
                                        v-if="role == 'Select Role'"
                                        v-bind="props"
                                        color="primary"
                                    >
                                    {{ role }}
                                    </v-btn>
                                    <v-btn
                                        v-if="role == 'President'"
                                        v-bind="props"
                                        color="purple-darken-3"
                                    >
                                    {{ role }}
                                    </v-btn>
                                    <v-btn
                                        v-if="role == 'Vice President'"
                                        v-bind="props"
                                        color="cyan-darken-1"
                                    >
                                    {{ role }}
                                    </v-btn>
                                    <v-btn
                                        v-if="role == 'Treasurer'"
                                        v-bind="props"
                                        color="amber-lighten-1"
                                    >
                                    {{ role }}
                                    </v-btn>
                                    <v-btn
                                        v-if="role == 'Secretary'"
                                        v-bind="props"
                                        color="green-darken-3"
                                    >
                                    {{ role }}
                                    </v-btn>
                                    <v-btn
                                        v-if="role == 'Member'"
                                        v-bind="props"
                                        color="blue-grey-lighten-1"
                                    >
                                    {{ role }}
                                    </v-btn>
                                </template>

                                <v-list>
                                    <v-list-item @click="role = 'President'" :active="role==='President'">
                                        President
                                    </v-list-item>
                                    <v-list-item @click="role = 'Vice President'" :active="role==='Vice President'">
                                        Vice President
                                    </v-list-item>
                                    <v-list-item @click="role = 'Treasurer'" :active="role==='Treasurer'">
                                        Treasurer
                                    </v-list-item>
                                    <v-list-item @click="role = 'Secretary'" :active="role==='Secretary'">
                                        Secretary
                                    </v-list-item>
                                    <v-list-item @click="role = 'Member'" :active="role==='Member'">
                                        Member
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                        </v-row>

                        <v-row v-if="error" class="mt-10">
                            <v-alert type="error" variant="tonal" class="mr-6">
                            {{ error }}
                            </v-alert>
                        </v-row>

                        <v-row class="justify-center">
                            <v-btn
                            type="submit"
                            class="mt-7 bg-primary"
                            width="150"
                            :loading="loading"
                            >
                            Add Member
                            </v-btn>
                        </v-row>
                    </v-form>
                </div>

                <div v-if="selected === 'finances'" class="mt-6">
                    <v-row>
                        <v-col cols="8">
                            <v-card>
                                <v-card-title>Transactions</v-card-title>
                                <v-card-text>
                                    <v-data-table :items="transactions" :headers="[{title:'Date',key:'date'},{title:'Description',key:'description'},{title:'Amount',key:'amount'}]" />
                                    <v-row class="mt-4">
                                        <v-col>
                                            <v-btn @click="addTransaction">Add Transaction</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col cols="4">
                            <v-card>
                                <v-card-title>Balance</v-card-title>
                                <v-card-text>
                                    <div class="text-h5">{{ balance }}</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>

                <div v-if="selected === 'settings'" class="mt-6">
                    <v-card>
                        <v-card-title>Settings</v-card-title>
                        <v-card-text>
                            <div>Manage club settings, roles, and integration options here.</div>
                        </v-card-text>
                    </v-card>
                </div>

                <div v-if="selected === 'manageMember'" class="mt-6">
                    <v-card>
                        <v-card-title>Settings</v-card-title>
                        <v-card-text>
                            <div>Manage club settings, roles, and integration options here.</div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-container>
        </v-main>
    </v-app>
</template>

<style scoped>
.mt-6 { margin-top: 24px; }
</style>