import axios from "axios";

export const API_BASE_URL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosInstance;

export const fetchPics = async () => {
  const { data } = await axiosInstance.get("/pics-hard-mode", {
    params: {
      size: 500000,
    },
  });
  return data;
};

export const uploadPic = async (data) => {
  const formData = new FormData();
  formData.append("photo", data);
  await axiosInstance.post("/pics", formData);
};
