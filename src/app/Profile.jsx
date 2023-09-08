import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { getCommentsByUser } from "../api";
import { UserData } from "./Profile/UserData";
import { ArticlePreviews } from "./Feed/ArticlePreviews";
import { Comments } from "./Article/Comments";
import { ItemDropDown } from "./Profile/ItemDropDown";

export function Profile() {
  const { username } = useParams();
  const [articles, setArticles] = useState({ totalCount: 0, articles: [] });
  const [comments, setComments] = useState([]);
  const [queries, setQueries] = useState({
    limit: 1000,
    page: 1,
    author: username,
    sortBy: "created_at",
    topic: "",
    order: "desc",
  });

  const commentsComponent = (
    <Comments
      getFunction={getCommentsByUser}
      getKey={username}
      comments={comments}
      setComments={setComments}
      showArticleLinks={true}
    />
  );

  const articlesComponent = (
    <ArticlePreviews
      articles={articles}
      setArticles={setArticles}
      queries={queries}
    />
  );

  return (
    <>
      <UserData username={username} />
      <ItemDropDown
        image="../../../book.png"
        header="Articles"
        component={articlesComponent}
      />
      <ItemDropDown
        image="../../../comments.png"
        header="Comments"
        component={commentsComponent}
      />
    </>
  );
}
