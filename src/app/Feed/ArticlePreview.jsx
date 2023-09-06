export function ArticlePreview({ article }) {
  return (
    <>
      <div className="article-preview-top">
        <div className="article-preview-header">
          <a href={`/articles/${article.article_id}`} className="article-link">
            <h2 className="article-preview-title">{article.title}</h2>
          </a>
          <div className="article-preview-profile">
            <h4 className="article-preview-author">{article.author}</h4>
          </div>
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
        <div className="article-preview-stat">
          <img
            className="article-preview-logo"
            src="../../../comments.png"
            alt="number of comments"
          ></img>
          <p className="article-preview-stat-text">{article.comment_count}</p>
        </div>
        <div className="article-preview-stat">
          <img
            className="article-preview-logo"
            src="../../../star.png"
            alt="number of stars"
          ></img>
          <p className="article-preview-stat-text">{article.votes}</p>
        </div>
      </div>
      <h5 className="article-preview-datetime">
        {new Date(article.created_at).toDateString()}&nbsp;
      </h5>
    </>
  );
}
