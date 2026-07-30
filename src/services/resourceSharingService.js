import axios from "axios";

const API = "http://localhost:8081/api/resource-sharing";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
};

export const createRequest = async (requestData) => {
    return axios.post(API, requestData, getHeaders());
};

export const getRequests = async () => {
    return axios.get(API, getHeaders());
};

export const approve = async (id) => {
    return axios.put(`${API}/${id}/approve`, {}, getHeaders());
};

export const reject = async (id) => {
    return axios.put(`${API}/${id}/reject`, {}, getHeaders());
};

export const complete = async (id) => {
    return axios.put(`${API}/${id}/complete`, {}, getHeaders());
};

// Aliases for compatibility
export const approveRequest = approve;
export const rejectRequest = reject;
export const completeRequest = complete;
