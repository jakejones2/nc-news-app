import axios from "axios";

const api = axios.create({
  baseURL: "https://nc-news-tm72.onrender.com/api",
});

export function getArticles() {
  return api.get(`/articles`).then((response) => {
    return response.data;
  });
}

export function getArticle(id) {
  return api.get(`/articles/${id}`).then((response) => {
    return response.data.article;
  });
}

export function getCommentsByArticle(id) {
  return api.get(`/articles/${id}/comments`).then((response) => {
    return response.data.comments;
  });
}

export function patchArticle(id, num) {
  return api.patch(`/articles/${id}`, { inc_votes: num }).then((response) => {
    return response.data;
  });
}

export function postComment(id, body) {
  return api.post(`articles/${id}/comments`, body).then((response) => {
    return response.data;
  });
}
