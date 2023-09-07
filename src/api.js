import axios from "axios";

const api = axios.create({
  baseURL: "https://articles-api-zepx.onrender.com/",
});

export function tryAgainWithRefresh(func, setUser, ...args) {
  api.get("refresh").then(({ data: { accessToken } }) => {
    setUser({ username: user.username, token: accessToken });
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    return func(...args, options);
  });
}

export function getArticles({
  limit = 10,
  page = 1,
  author,
  sortBy = "created_at",
  order = "asc",
  topic,
}) {
  let url = `api/articles?limit=${limit}&p=${page}&sort_by=${sortBy}&order=${order}`;
  if (author) url += `&author=${author}`;
  if (topic) url += `&topic=${topic}`;
  return api.get(url).then((response) => {
    return response.data;
  });
}

export function getArticle(id) {
  return api.get(`api/articles/${id}`).then((response) => {
    return response.data.article;
  });
}

export function getCommentsByArticle(id) {
  return api.get(`api/articles/${id}/comments?limit=1000`).then((response) => {
    return response.data.comments;
  });
}

export function patchArticle(id, num, options) {
  return api
    .patch(`api/articles/${id}`, { inc_votes: num }, options)
    .then((response) => {
      return response.data;
    });
}

export function postComment(id, body, options) {
  return api
    .post(`api/articles/${id}/comments`, body, options)
    .then((response) => {
      return response.data;
    });
}

export function patchComment(id, num, options) {
  return api
    .patch(`api/comments/${id}`, { inc_votes: num }, options)
    .then((response) => {
      return response.data;
    });
}

export function getTopics() {
  return api.get("api/topics").then((response) => {
    return response.data.topics;
  });
}

export function deleteComment(id) {
  return api.delete(`api/comments/${id}`);
}

export function postUser(body) {
  return api.post(`api/users`, body).then((response) => {
    return response.data;
  });
}

export function postAuth(body) {
  return api.post(`auth`, body).then((response) => {
    return response.data.accessToken;
  });
}

export function getLogout() {
  return api.get(`logout`);
}

export function getUserArticleVotes(username) {
  return api.get(`api/users/${username}/votes/articles`).then((response) => {
    return response.data.articleVotes;
  });
}

export function getUserCommentVotes(username) {
  return api.get(`api/users/${username}/votes/comments`).then((response) => {
    return response.data.commentVotes;
  });
}

export function postArticle(body, options) {
  return api.post(`api/articles`, body, options);
}

export function postTopic(topic) {
  return api.post("api/topics", topic);
}

export function getUser(username) {
  return api.get(`api/users/${username}`).then((response) => {
    return response.data.user;
  });
}

export function getCommentsByUser(username) {
  return api.get(`api/users/${username}/comments`).then((response) => {
    return response.data.comments;
  });
}
