import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/' // All requests will be sent to this base URL
})

axiosInstance.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('stm-accessToken')
    // Add the access token to the headers
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