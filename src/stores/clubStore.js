import { defineStore } from 'pinia';
export const useClubStore = defineStore('club', {
    state: () => ({
        id: null,
        name: '',
        description: '',
        logo_url: undefined,
    }),
    getters: {
        hasClub: (state) => !!state.id,
        club: (state) => ({
            id: state.id,
            name: state.name,
            description: state.description,
        }),
    },
    actions: {
        setClub(payload) {
            if (payload.id !== undefined)
                this.id = payload.id ?? null;
            if (payload.name !== undefined)
                this.name = payload.name;
            if (payload.description !== undefined)
                this.description = payload.description;
        },
        setId(value) {
            this.id = value;
        },
        setName(value) {
            this.name = value;
        },
        setDescription(value) {
            this.description = value;
        },
        setLogoUrl(value) {
            this.logo_url = value;
        },
        resetClub() {
            this.id = null;
            this.name = '';
            this.description = '';
            this.logo_url = undefined;
        },
    },
});
export default useClubStore;
