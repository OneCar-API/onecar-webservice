import axios from 'axios';

import generateToken from '@config/authHere';

const api = axios.create({
  baseURL: process.env.HERE_BASE_API_URL,
  headers: { 'X-Custom-Header': `${generateToken}` },
});

export default api;
