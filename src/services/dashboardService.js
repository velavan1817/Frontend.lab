import axios from "axios";

const API = "http://localhost:8081/api/dashboard/utilization";

export const getUtilization = async () => {
    const token = localStorage.getItem("token");

    return axios.get(API, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
