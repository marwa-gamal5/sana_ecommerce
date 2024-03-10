import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://192.168.11.100:8015/",
})

export default axiosInstance