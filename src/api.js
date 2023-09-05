import axios from "axios";

const api = axios.create({
  baseURL: "https://nc-news-tm72.onrender.com/api",
});

export function getArticles({ limit, page, author, sortBy, order, topic }) {
  let url = `/articles?limit=${limit}&p=${page}&sort_by=${sortBy}&order=${order}`;
  if (author) url += `&author=${author}`;
  if (topic) url += `&topic=${topic}`;
  return api.get(url).then((response) => {
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
  return api.post(`/articles/${id}/comments`, body).then((response) => {
    return response.data;
  });
}

export function getTopics() {
  return api.get("/topics").then((response) => {
    return response.data.topics;
  });
}

export function deleteComment(id) {
  return api.delete(`/comments/${id}`).then((response) => {
    return;
  });
}
