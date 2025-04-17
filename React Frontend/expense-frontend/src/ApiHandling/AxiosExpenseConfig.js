import axios from "axios";


const apiExpense = axios.create({
    baseURL: "http://localhost:8080/expense/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false
}
)

apiExpense.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        config.headers.Authorization = `Bearer ${token}`;
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiExpense;