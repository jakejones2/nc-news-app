import axios, { AxiosRequestConfig } from "axios";
import { SignUpState } from "./app/SignUp";
import { ArticlesState } from "./app/Feed";
import { ArticleInterface } from "./app/Article";
import { CommentInterface } from "./app/Article/Comment";
import { ArticleCommentsState } from "./app/Article/ArticleComments";
import { NewArticleContent } from "./app/Post";
import { NewCommentInterface } from "./app/Article/NewComment";

export type validSorts = "created_at" | "author" | "title" | "article_id" | "topic" | "article_img_url" | "votes"
export type validOrders = "asc" | "desc"

interface headers {
  Authorization?: string
}

interface axiosOptions {
  headers?: headers
}

export interface Query {
  limit?: number,
  page?: number,
  sortBy?: validSorts,
  order?: validOrders,
  author?: string,
  topic?: string
}

export interface VoteData {
  username: string,
  votes: number
}

export interface UserArticleVoteData extends VoteData{
  article_id: number
}

export interface UserCommentVoteData extends VoteData {
  comment_id: number,
}

export interface UserInterface {
  username: string,
  name: string,
  avatar_url: string
}

export interface TopicInterface {
  slug: string,
  description: string
}

export interface NewUser {
  username: string,
  name: string,
  avatar_url: string
}

export interface PostAuth {
  username: string,
  password: string
}


// api calls

const api = axios.create({
  baseURL: "https://articles-api-zepx.onrender.com/",
});

export function getArticles({
  limit = 12,
  page = 1,
  author,
  sortBy = "created_at",
  order = "asc",
  topic,
}: Query): Promise<ArticlesState> {
  let url = `api/articles?limit=${limit}&p=${page}&sort_by=${sortBy}&order=${order}`;
  if (author) url += `&author=${author}`;
  if (topic) url += `&topic=${topic}`;
  return api.get(url).then((response) => {
    return response.data;
  });
}

export function getArticle(id: number): Promise<ArticleInterface> {
  return api.get(`api/articles/${id}`).then((response) => {
    return response.data.article;
  });
}

export function getCommentsByArticle(
  id: number | string,
  { page = 1, limit = 10, sortBy = "created_at", order = "desc" }: Query
): Promise<ArticleCommentsState> {
  return api
    .get(
      `api/articles/${id}/comments?limit=${limit}&p=${page}&sort_by=${sortBy}&order=${order}`
    )
    .then((response) => {
      return response.data;
    });
}

export function patchArticle(id: number, num: number, options: axiosOptions): Promise<ArticleInterface> {
  return api
    .patch(`api/articles/${id}`, { inc_votes: num }, options as AxiosRequestConfig)
    .then((response) => {
      return response.data.article;
    });
}

export function postComment(id: number, body: NewCommentInterface, options: axiosOptions): Promise<CommentInterface> {
  return api
    .post(`api/articles/${id}/comments`, body, options as AxiosRequestConfig)
    .then((response) => {
      return response.data.comment;
    });
}

export function patchComment(id: number, num: number, options: axiosOptions): Promise<CommentInterface> {
  return api
    .patch(`api/comments/${id}`, { inc_votes: num }, options as AxiosRequestConfig)
    .then((response) => {
      return response.data.comment;
    });
}

export function getTopics(): Promise<TopicInterface[]> {
  return api.get("api/topics").then((response) => {
    return response.data.topics;
  });
}

export function deleteComment(id: number, options: axiosOptions): Promise<void> {
  return api.delete(`api/comments/${id}`, options as AxiosRequestConfig);
}

export function deleteArticle(id: number, options: axiosOptions): Promise<void> {
  return api.delete(`api/articles/${id}`, options as AxiosRequestConfig);
}

export function postUser(body: SignUpState): Promise<NewUser> {
  return api.post(`api/users`, body).then((response) => {
    return response.data;
  });
}

export function postAuth(body: PostAuth): Promise<string> {
  return api.post(`auth`, body).then((response) => {
    return response.data.accessToken;
  });
}

export function getLogout(): Promise<void> {
  return api.get(`logout`);
}

export function getUserArticleVotes(username: string): Promise<UserArticleVoteData[]> {
  if (username === "guest") {
    return Promise.resolve([]);
  }
  return api.get(`api/users/${username}/votes/articles`).then((response) => {
    return response.data.articleVotes;
  });
}

export function getUserCommentVotes(username: string): Promise<UserCommentVoteData[]> {
  if (username === "guest") {
    return Promise.resolve([]);
  }
  return api.get(`api/users/${username}/votes/comments`).then((response) => {
    return response.data.commentVotes;
  });
}

export function postArticle(body: NewArticleContent, options: axiosOptions): Promise<void> {
  return api.post(`api/articles`, body, options as AxiosRequestConfig);
}

export function postTopic(topic: TopicInterface): Promise<void> {
  return api.post("api/topics", topic);
}

export function getUser(username: string): Promise<UserInterface> {
  return api.get(`api/users/${username}`).then((response) => {
    return response.data.user;
  });
}

export function getCommentsByUser(
  key: string | number,
  { page = 1, limit = 10, sortBy = "created_at", order = "desc" }: Query
): Promise<ArticleCommentsState> {
  return api
    .get(
      `api/users/${key}/comments?p=${page}&limit=${limit}&sort_by=${sortBy}&order=${order}`
    )
    .then((response) => {
      return response.data;
    });
}

export function getTopic(topicTarget: string): Promise<string> {
  return api.get("api/topics").then((response) => {
    return response.data.topics.find((topic: TopicInterface) => {
      return topic.slug === topicTarget;
    })?.description;
  });
}

export function getComment(id: number): Promise<CommentInterface> {
  return api.get(`api/comments/${id}`).then(({ data }) => {
    return data.comment;
  });
}
