import axios, { Axios } from 'axios';

export const BASE_URL: string = process.env.NODE_ENV === 'production'
  ? `${process.env.VUE_APP_SERVER_BASE_URL}:${process.env.VUE_APP_SERVER_PORT}`
  : `http://localhost:${process.env.VUE_APP_SERVER_PORT}`;

export const api: Axios = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});