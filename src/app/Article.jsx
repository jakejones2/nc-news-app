import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticle, patchArticle } from "../api";
import { Comments } from "./Article/Comments";

export function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState({});
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [errorLoadingArticle, setErrorLoadingArticle] = useState(false);
  const [dropDown, setDropDown] = useState("drop-up");
  const [starred, setStarred] = useState("");
  const [errorVoting, setErrorVoting] = useState(false);

  useEffect(() => {
    setIsLoadingArticle(true);
    setErrorLoadingArticle(false);
    getArticle(id)
      .then((article) => {
        setArticle(article);
        setIsLoadingArticle(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorLoadingArticle(true);
      });
  }, []);

  function toggleDropDownButton() {
    setDropDown((className) => {
      if (className === "drop-down") {
        return "drop-up";
      } else return "drop-down";
    });
  }

  function handlePatchError(err, num) {
    console.log(err);
    setErrorVoting(true);
    increaseVoteInState(num);
    if (num > 0) {
      setStarred("star");
    } else {
      setStarred("");
    }
  }

  function increaseVoteInState(num) {
    setArticle((article) => {
      const newArticle = { ...article };
      newArticle.votes += num;
      setArticle(newArticle);
      return newArticle;
    });
  }

  function increaseVote() {
    setErrorVoting(false);
    if (starred) {
      setStarred("");
      increaseVoteInState(-1);
      patchArticle(id, -1).catch((err) => {
        handlePatchError(err, 1);
      });
    } else {
      setStarred("star");
      increaseVoteInState(1);
      patchArticle(id, 1).catch((err) => {
        handlePatchError(err, -1);
      });
    }
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
      <h2 id="article-title">{article.title}</h2>
      <h4 id="article-topic">{article.topic}</h4>
      <div id="article-info">
        <h3 id="article-author">{article.author}</h3>
        <p id="article-created-at">
          {new Date(article.created_at).toDateString()}
        </p>
      </div>
      <div id="article-content">
        <p id="article-body">{article.body}</p>
        <img
          id="article-image"
          src={article.article_img_url}
          alt="article image"
        ></img>
      </div>
      <div id="article-stats">
        <div className="article-stat" onClick={increaseVote}>
          <img
            className={"article-logo " + starred}
            src="../../../public/star-gold.png"
          ></img>
          <p className="article-stat-text">{article.votes}</p>
        </div>
        <div className="article-stat">
          <img
            className="article-logo"
            src="../../../public/comments.png"
          ></img>
          <p className="article-stat-text">{article.comment_count}</p>
        </div>
        <button id="drop-down-comments" onClick={toggleDropDownButton}>
          <div className={dropDown}></div>
        </button>
        {errorVoting && (
          <span className="vote-error">
            Your last star didn't go through! Try again later.
          </span>
        )}
      </div>
      {dropDown === "drop-down" && <Comments articleId={id} />}
    </article>
  );
}
