import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/'
})

axiosInstance.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('stm-accessToken')
    if (accessToken) {
        if(config.headers) config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`
        else config.headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(accessToken)}`
        }
    }
    return config
},
    error => Promise.reject(error)
)

export default axiosInstance