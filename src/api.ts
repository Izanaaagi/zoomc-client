import axios, {Axios} from 'axios';

const BASE_URL: string = process.env.NODE_ENV === 'production' ? 'http://chat.projects.ga:5000' : 'http://localhost:5000';

export const api: Axios = axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true
})