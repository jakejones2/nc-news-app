import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";

export function Comment({ setComments, comment, removeComment }) {
  const { user } = useContext(UserContext);

  function handleCommentDelete() {
    setComments((comments) => {
      return comments.filter((item) => {
        return item.comment_id !== comment.comment_id;
      });
    });
    removeComment(comment.comment_id);
  }

  return (
    <article className="comment">
      <div className="comment-info">
        <h6 className="comment-author">{comment.author}</h6>
        <p className="comment-datetime">
          {new Date(comment.created_at).toDateString()}
        </p>
      </div>
      <p className="comment-body">{comment.body}</p>
      {user === comment.author && (
        <img
          onClick={handleCommentDelete}
          src="../../../bin.png"
          className="comment-logo bin"
          alt="bin"
        ></img>
      )}
      <div className="comment-stat">
        <img
          className="comment-logo"
          src="../../../star-cropped.png"
          alt="star"
        ></img>
        <p className="comment-stat-text">{comment.votes}</p>
      </div>
    </article>
  );
}
