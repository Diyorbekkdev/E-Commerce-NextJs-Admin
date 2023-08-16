import axios, { AxiosInstance } from 'axios';
import { TOKEN } from '@/constants';
import { getCookie } from 'cookies-next';

export const request: AxiosInstance = axios.create({
  baseURL: 'https://vodiy-parfum-backend.vercel.app/api/v1/',
  timeout: 10000,
  headers: {
    Authorization: getCookie(TOKEN) ? "Bearer " + getCookie(TOKEN) : null
  }
})