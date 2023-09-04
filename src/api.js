import axios from "axios";

const api = axios.create({
  baseURL: "https://articles-api-zepx.onrender.com/api",
});

export function getArticles() {
  return api.get(`/articles`).then((response) => {
    return response.data;
  });
}
