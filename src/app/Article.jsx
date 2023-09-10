import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../contexts";
import { Link, useParams, Navigate, useSearchParams } from "react-router-dom";
import {
  getArticle,
  getUserArticleVotes,
  patchArticle,
  tryAgainWithRefresh,
} from "../api";
import { Comments } from "./Article/Comments";
import { Star } from "./Reuse/Star";
import { ArticleComments } from "./Article/ArticleComments";
import { Topic } from "./Article/Topic";

export function Article() {
  const { id } = useParams();
  const { setUser, user } = useContext(UserContext);
  const [article, setArticle] = useState({});
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [errorLoadingArticle, setErrorLoadingArticle] = useState(false);
  const [starred, setStarred] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [showComments, setShowComments] = useSearchParams();
  const commentsQuery = new URLSearchParams(window.location.search).get(
    "comments"
  );

  useEffect(() => {
    let incomingArticle;
    setIsLoadingArticle(true);
    setErrorLoadingArticle(false);
    getArticle(id)
      .then((article) => {
        incomingArticle = article;
        setArticle(article);
        return getUserArticleVotes(user.username);
      })
      .then((articleVotes) => {
        const currentVote = articleVotes.find((vote) => {
          return vote.article_id === incomingArticle.article_id;
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
      <div className="articles-error">
        Can't fetch this article right now - sorry!
      </div>
    );
  }

  if (isLoadingArticle) {
    return <span className="loader"></span>;
  }

  return (
    <article id="article">
      <div id="title-topic">
        <h2 id="article-title">{article.title}</h2>
        <Topic topic={article.topic} type="preview-topic article-topic" />
      </div>
      <div id="article-info">
        <Link to={`/profile/${article.author}`} className="article-link">
          <h3 id="article-author">{article.author}</h3>
        </Link>
        <p id="article-created-at">
          {new Date(article.created_at).toDateString()}
        </p>
      </div>
      <div id="article-content">
        <p className={`article-body article-body-comments-${commentsQuery}`}>
          {article.body}
        </p>
        {commentsQuery === "hide" && (
          <img
            id="article-image"
            src={article.article_img_url}
            alt="article image"
          ></img>
        )}
      </div>
      <div id="article-stats">
        {user.username !== "guest" && (
          <Star
            type="article"
            patchFunction={patchArticle}
            id={article.article_id}
            votes={article.votes}
            userVotes={starred}
          />
        )}
        <div className="article-stat" onClick={toggleCommentsView}>
          <img
            className="article-logo comments-logo"
            src="../../../comments.png"
          ></img>
          <p className="article-stat-text">{article.comment_count}</p>
        </div>
        <button id="drop-down-comments" onClick={toggleCommentsView}>
          <div
            className={commentsQuery === "show" ? "drop-down" : "drop-up"}
          ></div>
        </button>
      </div>
      {commentsQuery === "show" && <ArticleComments articleId={id} />}
    </article>
  );
}
