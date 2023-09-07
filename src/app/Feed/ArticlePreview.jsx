import { Link } from "react-router-dom";
import { Star } from "./Star";
import { patchArticle } from "../../api";

export function ArticlePreview({ article, userVotes }) {
  return (
    <>
      <div className="article-preview-top">
        <div className="article-preview-header">
          <Link
            to={`/articles/${article.article_id}?comments=hide`}
            className="article-link"
          >
            <h2 className="article-preview-title">{article.title}</h2>
          </Link>
          <Link to={`/profile/${article.author}`} className="article-link">
            <div className="article-preview-profile">
              <h4 className="article-preview-author">{article.author}</h4>
            </div>
          </Link>
        </div>
        <h3 className="article-topic preview-topic">{article.topic}</h3>
      </div>
      <div className="image-container">
        <img
          className="article-preview-img"
          src={article.article_img_url}
          alt="article-image"
        ></img>
      </div>
      <div className="article-preview-stats">
        <Link to={`/articles/${article.article_id}?comments=show`}>
          <div className="article-preview-stat">
            <img
              className="article-preview-logo"
              src="../../../comments.png"
              alt="number of comments"
            ></img>
            <p className="article-preview-stat-text">{article.comment_count}</p>
          </div>
        </Link>
        <Star
          patchFunction={patchArticle}
          type="article-preview"
          userVotes={userVotes}
          id={article.article_id}
          votes={article.votes}
        />
      </div>
      <h5 className="article-preview-datetime">
        {new Date(article.created_at).toDateString()}&nbsp;
      </h5>
    </>
  );
}
