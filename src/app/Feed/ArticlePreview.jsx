import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { Link } from "react-router-dom";
import { Star } from "./Star";
import { deleteArticle, patchArticle } from "../../api";
import { Topic } from "../Article/Topic";
import { ConfirmationModal } from "../Components/ConfirmationModal";

export function ArticlePreview({
  article,
  userVotes,
  articles,
  setArticles,
  setQueries,
}) {
  const { user } = useContext(UserContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleArticleDelete() {
    setArticles(({ articles, totalCount }) => {
      const filteredArticles = articles.filter((item) => {
        return item.article_id !== article.article_id;
      });
      return { totalCount: totalCount, articles: filteredArticles };
    });
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    deleteArticle(article.article_id, options).catch((err) => {
      console.log(err);
    });
    // these errors need handling properly
  }

  return (
    <>
      <div className="article-preview-top">
        <div className="article-preview-header">
          <Link
            to={`/article/${article.article_id}?comments=hide`}
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
        <Topic
          topic={article.topic}
          type="preview-topic"
          setQueries={setQueries}
        />
      </div>
      <div className="image-container">
        <img
          className="article-preview-img"
          src={article.article_img_url}
          alt="article-image"
        ></img>
      </div>
      <div className="article-preview-stats">
        <Link to={`/article/${article.article_id}?comments=show`}>
          <div className="article-preview-stat">
            <img
              className="article-preview-logo comments-logo"
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
        {user.username === article.author ? (
          <div className="article-preview-stat">
            <img
              onClick={() => {
                setShowDeleteModal(true);
              }}
              src="../../../bin.png"
              className="article-preview-logo article-bin"
              alt="bin"
            ></img>
          </div>
        ) : (
          <div className="space"></div>
        )}
      </div>
      <h5 className="article-preview-datetime">
        {new Date(article.created_at).toDateString()}&nbsp;
      </h5>
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this article? There is no going back!"
          setShowState={setShowDeleteModal}
          confirmFunction={handleArticleDelete}
          args={[]}
        />
      )}
    </>
  );
}
