// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7197/api", // <-- cambia por tu URL real
  timeout: 10000,
}); 