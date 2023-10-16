import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts";
import { Link, useParams, Navigate, useSearchParams } from "react-router-dom";
import { getArticle, getUserArticleVotes, patchArticle } from "../api";
import { Star } from "./Reuse/Star";
import { ArticleComments } from "./Article/ArticleComments";
import { Topic } from "./Article/Topic";

export interface ArticleInterface {
  article_id: number,
  title: string,
  topic: string,
  author: string,
  body: string,
  article_img_url: string,
  created_at: string,
  votes: number,
  comment_count: number
}

export function Article() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [article, setArticle] = useState<ArticleInterface>({
    article_id: 0,
    title: "",
    topic: "",
    author: "",
    body: "",
    article_img_url: "",
    created_at: "",
    votes: 0,
    comment_count: 0
  });
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [errorLoadingArticle, setErrorLoadingArticle] = useState(false);
  const [starred, setStarred] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [showComments, setShowComments] = useSearchParams();
  const commentsQuery = new URLSearchParams(window.location.search).get(
    "comments"
  );

  useEffect(() => {
    setIsLoadingArticle(true);
    setErrorLoadingArticle(false);
    getArticle(Number(id || 1))
      .then((newArticle) => {
        setArticle(() => newArticle);
        return getUserArticleVotes(user.username);
      })
      .then((articleVotes) => {
        const currentVote = articleVotes.find((vote) => {
          return vote.article_id === article.article_id;
        });
        if (currentVote?.votes) setStarred(true);
        setIsLoadingArticle(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorLoadingArticle(true);
      });
  }, []);

  function toggleCommentsView() {
    if (commentsQuery === "hide") {
      setShowComments({ comments: "show" });
    } else {
      setShowComments({ comments: "hide" });
    }
  }

  if (redirect) {
    return <Navigate to="/login" />;
  }

  if (errorLoadingArticle) {
    return (
      <div className="error">Can't fetch this article right now - sorry!</div>
    );
  }

  if (isLoadingArticle) {
    return <span className="loader"></span>;
  }

  return (
    <article className="article">
      <div className="article__topic">
        <h2 className="article__title">{article.title}</h2>
        <Topic topic={article.topic} type="topic topic--article" />
      </div>
      <div className="article__info">
        <Link to={`/profile/${article.author}`}>
          <h3 className="article__author">{article.author}</h3>
        </Link>
        <p className="article__created-at">
          {new Date(article.created_at).toDateString()}
        </p>
      </div>
      <div className="article__content">
        <p className={`article__body article__body--comments-${commentsQuery}`}>
          {article.body}
        </p>
        {commentsQuery === "hide" && (
          <img
            className="article__img"
            src={article.article_img_url}
            alt="article image"
          ></img>
        )}
      </div>
      <div className="info-bar">
        {user.username !== "guest" && (
          <Star
            type="info-bar"
            patchFunction={patchArticle}
            id={article.article_id}
            votes={article.votes}
            userVotes={starred}
          />
        )}
        <div className="info-bar__stat" onClick={toggleCommentsView}>
          <img
            className="info-bar__logo info-bar__logo--comments"
            src="../../../comments.png"
          ></img>
          <p className="info-bar__stat-text">{article.comment_count}</p>
        </div>
        <button onClick={toggleCommentsView}>
          <div
            className={
              commentsQuery === "show"
                ? "dropdown dropdown--down"
                : "dropdown dropdown--up"
            }
          ></div>
        </button>
      </div>
      {commentsQuery === "show" && <ArticleComments articleId={Number(id || 1)} />}
    </article>
  );
}
