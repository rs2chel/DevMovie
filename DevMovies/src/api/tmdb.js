// src/api/tmdb.js
import axios from "axios";

const tmdb = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 15000,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN || ""}`,
    },
});

tmdb.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("TMDB error:", err?.response || err.message);
        return Promise.reject(err);
    }
);

export default tmdb;