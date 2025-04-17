import axios from "axios";

const authApi = axios.create({
    baseURL: "http://localhost:8080/api/auth/",
    headers: {
        "content-type": "application/json",
    },
    withCredentials:false
})

export default authApi;