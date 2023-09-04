export function ArticlePreview({ article }) {
  return (
    <article id="article-preview">
      <img
        className="article-preview-img"
        src={article.article_img_url}
        alt="article-image"
      ></img>
      <h2 className="article-preview-title">{article.title}</h2>
      <h3 className="article-preview-topic">{article.category}</h3>
      <h5 className="article-preview-datetime">{article.created_at}</h5>
      <div className="article-preview-profile">
        <h4 className="article-preview-author"></h4>
      </div>
      <div className="article-preview-stats">
        <div className="article-preview-stat">
          <img
            className="article-preview-logo"
            src="../../media/comments.png"
          ></img>
          <p className="article-preview-stat-text">{article.comment_count}</p>
        </div>
        <div className="article-preview-stat">
          <img
            className="article-preview-logo"
            src="../../media/star.png"
          ></img>
          <p className="article-preview-stat-text">{article.votes}</p>
        </div>
      </div>
    </article>
  );
}
