import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { Link } from "react-router-dom";
import { Star } from "../Reuse/Star";
import { Query, deleteArticle, patchArticle } from "../../api";
import { Topic } from "../Article/Topic";
import { ConfirmationModal } from "../Reuse/ConfirmationModal";
import { ArticlesState } from "../Feed";
import { ArticleInterface } from "../Article";

export function ArticlePreview({
  article,
  userVotes,
  setArticleData,
  setQueries,
}: {
  article: ArticleInterface,
  userVotes: number,
  setArticleData: Dispatch<SetStateAction<ArticlesState>>,
  setQueries?: Dispatch<SetStateAction<Query>>
}) {
  const { user } = useContext(UserContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleArticleDelete() {
    setArticleData(({ articles, totalCount }) => {
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
      <div className="article-preview__header-container">
        <div className="article-preview__header">
          <Link to={`/article/${article.article_id}?comments=hide`}>
            <h2 className="article-preview__title">{article.title}</h2>
          </Link>
          <Link to={`/profile/${article.author}`}>
            <h4 className="article-preview__author">{article.author}</h4>
          </Link>
        </div>
        <Topic topic={article.topic} type="topic" setQueries={setQueries} />
      </div>
      <div className="article-preview__img-container">
        <Link to={`/article/${article.article_id}?comments=hide`}>
          <img
            className="article-preview__img"
            src={article.article_img_url}
            alt="article-image"
          ></img>
        </Link>
      </div>
      <div className="article-preview__stats">
        <Link to={`/article/${article.article_id}?comments=show`}>
          <div className="article-preview__stat">
            <img
              className="article-preview__logo article-preview__logo--comments"
              src="../../../comments.png"
              alt="number of comments"
            ></img>
            <p className="article-preview__stat-text">
              {article.comment_count}
            </p>
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
          <div className="article-preview__stat">
            <img
              onClick={() => {
                setShowDeleteModal(true);
              }}
              src="../../../bin.png"
              className="article-preview__logo bin bin--article"
              alt="delete article"
            ></img>
          </div>
        ) : (
          <div className="space"></div>
        )}
      </div>
      <h5 className="article-preview__datetime">
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
