import { api } from './api';
export const uploadClubLogo = async (clubId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clubId', clubId.toString());
    try {
        const response = await api.post('/upload/club-logo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Logo upload failed:', error);
        throw error;
    }
};
export const getClubLogoUrl = (clubId) => {
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/logos/${clubId}.png`;
};
