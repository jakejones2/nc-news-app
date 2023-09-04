export function Comment({ comment }) {
  return (
    <article className="comment">
      <div className="comment-info">
        <h6 className="comment-author">{comment.author}</h6>
        <p className="comment-datetime">
          {new Date(comment.created_at).toDateString()}
        </p>
      </div>
      <p className="comment-body">{comment.body}</p>
      <div className="comment-stat">
        <img
          className="comment-logo"
          src="../../../public/star-cropped.png"
        ></img>
        <p className="comment-stat-text">{comment.votes}</p>
      </div>
    </article>
  );
}
