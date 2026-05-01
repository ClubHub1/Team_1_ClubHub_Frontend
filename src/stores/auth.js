// stores/auth.ts
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useFeathers } from '@/composables/feathersCompose';
import useUserStore from './user';
export const useAuthStore = defineStore('auth', () => {
    const { api } = useFeathers();
    const auth = useAuth({ api, servicePath: 'User' });
    const userStore = useUserStore();
    auth.reAuthenticate().then(res => {
        if (res) {
            userStore.setEmail(res.User?.email);
            userStore.setId(res.User?.id);
            userStore.setFirstName(res.User?.first_name);
            userStore.setLastName(res.User?.last_name);
            userStore.setProfilePhotoUrl(res.User?.profile_photo_url)
            userStore.setBio(res.User?.bio)
            userStore.setFacebookUrl(res.User?.facebook_url)
            userStore.setInstagramUrl(res.User?.instagram_url)
            userStore.setLinkedInUrl(res.User?.linkedin_url)
            userStore.setTwitterUrl(res.User?.twitter_url)
        }
    });
    return { ...auth };
});
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
