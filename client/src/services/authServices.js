import axios from 'axios';

async function login(data) {

    try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_URL}/login`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error)
    }
};

async function register(data) {

    try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_URL}/register`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error)
    }
};

async function logout() {

    try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_URL}/logout`, {}, {
            withCredentials: true
        });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return response.data;
    } catch (error) {
        console.error(error)
    }
};

async function history() {

    try {
        const response = await axios.get(`${import.meta.env.VITE_AUTH_URL}/history`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error)
    }
};

async function updateAccountDetails(data) {

    try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_URL}/update-account`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error)
    }
};

async function channel() {

    try {
        const response = await axios.get(`${import.meta.env.VITE_AUTH_URL}/channel/${username}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error)
    }
};

async function updateUserAvatar(data) {

    try {
        const response = await axios.patch(`${import.meta.env.VITE_AUTH_URL}/update-avatar-image`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error)
    }
};

async function updateUserCoverImage(data) {

    try {
        const response = await axios.patch(`${import.meta.env.VITE_AUTH_URL}/update-cover-image`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error)
    }
};

async function chnageCurrentPassword(data) {

    try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_URL}/change-password`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(error)
    }
};


export { login, logout, register, history, updateAccountDetails, updateUserAvatar, updateUserCoverImage, chnageCurrentPassword, channel }