import axios from "axios";
import { SignInState } from "./app/SignUp";

const api = axios.create({
  baseURL: "https://articles-api-zepx.onrender.com/",
});

// this query type needs to be set in state. See SignUp.tsx This actually needs renaming to SignUp!

type Query = {
  limit?: number,
  page?: number,
  sortBy?: "created_at" | "author" | "title" | "article_id" | "topic" | "article_img_url",
  order?: "asc" | "desc",
  author?: string,
  topic?: string
}

type headers = {
  Authorization?: string
}

type axiosOptions = {
  headers?: headers
}

export function getArticles({
  limit = 12,
  page = 1,
  author,
  sortBy = "created_at",
  order = "asc",
  topic,
}: Query) {
  let url = `api/articles?limit=${limit}&p=${page}&sort_by=${sortBy}&order=${order}`;
  if (author) url += `&author=${author}`;
  if (topic) url += `&topic=${topic}`;
  return api.get(url).then((response) => {
    return response.data;
  });
}

export function getArticle(id: number) {
  return api.get(`api/articles/${id}`).then((response) => {
    return response.data.article;
  });
}

export function getCommentsByArticle(
  id: number,
  { page = 1, limit = 10, sortBy = "created_at", order = "desc" }: Query
) {
  return api
    .get(
      `api/articles/${id}/comments?limit=${limit}&p=${page}&sort_by=${sortBy}&order=${order}`
    )
    .then((response) => {
      return response.data;
    });
}

export function patchArticle(id: number, num: number, options: axiosOptions) {
  return api
    .patch(`api/articles/${id}`, { inc_votes: num }, options)
    .then((response) => {
      return response.data;
    });
}

export function postComment(id: number, body, options: axiosOptions) {
  return api
    .post(`api/articles/${id}/comments`, body, options)
    .then((response) => {
      return response.data;
    });
}

export function patchComment(id: number, num: number, options: axiosOptions) {
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

export function deleteComment(id: number, options: axiosOptions) {
  return api.delete(`api/comments/${id}`, options);
}

export function deleteArticle(id: number, options: axiosOptions) {
  return api.delete(`api/articles/${id}`, options);
}

export function postUser(body: SignInState) {
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

export function getUserArticleVotes(username: string) {
  if (username === "guest") {
    return [];
  }
  return api.get(`api/users/${username}/votes/articles`).then((response) => {
    return response.data.articleVotes;
  });
}

export function getUserCommentVotes(username: string) {
  if (username === "guest") {
    return [];
  }
  return api.get(`api/users/${username}/votes/comments`).then((response) => {
    return response.data.commentVotes;
  });
}

export function postArticle(body, options: axiosOptions) {
  return api.post(`api/articles`, body, options);
}

export function postTopic(topic) {
  return api.post("api/topics", topic);
}

export function getUser(username: string) {
  return api.get(`api/users/${username}`).then((response) => {
    return response.data.user;
  });
}

export function getCommentsByUser(
  username: string,
  { page = 1, limit = 10, sortBy = "created_at", order = "desc" }: Query
) {
  return api
    .get(
      `api/users/${username}/comments?p=${page}&limit=${limit}&sort_by=${sortBy}&order=${order}`
    )
    .then((response) => {
      return response.data;
    });
}

export function getTopic(topicTarget: string) {
  return api.get("api/topics").then((response) => {
    return response.data.topics.find((topic) => {
      return topic.slug === topicTarget;
    })?.description;
  });
}

export function getComment(id: number) {
  return api.get(`api/comments/${id}`).then(({ data }) => {
    return data.comment;
  });
}
