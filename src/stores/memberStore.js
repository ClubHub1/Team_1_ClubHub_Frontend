import { defineStore } from 'pinia';
export const useMemberStore = defineStore('ClubMembership', {
    state: () => ({
        id: null,
        role: ''
    }),
    getters: {
        hasMember: (state) => !!state.id,
        Member: (state) => ({
            id: state.id,
            role: state.role
        }),
    },
    actions: {
        setMember(payload) {
            if (payload.id !== undefined)
                this.id = payload.id ?? null;
            if (payload.role !== undefined)
                this.name = payload.role;
        },
        setId(value) {
            this.id = value;
        },
        setRole(value) {
            this.role = value;
        },
        resetMember() {
            this.id = null;
            this.role = '';
        },
    },
});
export default useMemberStore;
