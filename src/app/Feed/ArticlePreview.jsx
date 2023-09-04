export function ArticlePreview({ article }) {
  return (
    <>
      <a href={`/articles/${article.article_id}`} className="article-link">
        <h2 className="article-preview-title">{article.title}</h2>
      </a>
      <div className="article-preview-profile">
        <h4 className="article-preview-author">{article.author}</h4>
      </div>
      <article className="article-preview-body">
        <img
          className="article-preview-img"
          src={article.article_img_url}
          alt="article-image"
        ></img>
        <div className="article-preview-info">
          <h3 className="article-preview-topic">{article.topic}</h3>
          <div className="article-preview-stats">
            <div className="article-preview-stat">
              <img
                className="article-preview-logo"
                src="../../../public/comments.png"
              ></img>
              <p className="article-preview-stat-text">
                {article.comment_count}
              </p>
            </div>
            <div className="article-preview-stat">
              <img
                className="article-preview-logo"
                src="../../../public/star.png"
              ></img>
              <p className="article-preview-stat-text">{article.votes}</p>
            </div>
          </div>
        </div>
      </article>
      <h5 className="article-preview-datetime">
        {new Date(article.created_at).toDateString()}&nbsp;
      </h5>
    </>
  );
}