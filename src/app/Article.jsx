import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticle } from "../api";

export function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState({});
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);

  useEffect(() => {
    setIsLoadingArticle(true);
    getArticle(id).then((article) => {
      setArticle(article);
      setIsLoadingArticle(false);
    });
  }, []);

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
        <div className="article-stat">
          <img
            className="article-logo"
            src="../../../public/comments.png"
          ></img>
          <p className="article-stat-text">{article.comment_count}</p>
        </div>
        <div className="article-stat">
          <img className="article-logo" src="../../../public/star.png"></img>
          <p className="article-stat-text">{article.votes}</p>
        </div>
      </div>
    </article>
  );
}
