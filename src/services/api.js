import axios from "axios";

const SUPABASE_URL = "https://ghbbleysmtkwuwuoiexq.supabase.co/rest/v1";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYmJsZXlzbXRrd3V3dW9pZXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MDUwMDYsImV4cCI6MjA4NTQ4MTAwNn0.VP96pk6H_FN64SlkRSMWFcHPsddcX0b5fVJnBLwuEKo";

const api = axios.create({
  baseURL: SUPABASE_URL,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
});

export default api;
