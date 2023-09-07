import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts";
import { patchComment } from "../../api";
import { Star } from "../Feed/Star";

export function Comment({ setComments, comment, removeComment, userVotes }) {
  const { user } = useContext(UserContext);

  function handleCommentDelete() {
    setComments((comments) => {
      return comments.filter((item) => {
        return item.comment_id !== comment.comment_id;
      });
    });
    removeComment(comment.comment_id);
    // need to do this properly - what if delete fails?
    // need an error message state etc.
  }

  return (
    <article className="comment">
      <div className="comment-info">
        <Link to={`/profile/${comment.author}`} className="article-link">
          <h6 className="comment-author">{comment.author}</h6>
        </Link>
        <p className="comment-datetime">
          {new Date(comment.created_at).toDateString()}
        </p>
      </div>
      <p className="comment-body">{comment.body}</p>
      {user === comment.author ? (
        <img
          onClick={handleCommentDelete}
          src="../../../bin.png"
          className="comment-logo bin"
          alt="bin"
        ></img>
      ) : (
        <div className="space"></div>
      )}
      <Star
        type="comment"
        patchFunction={patchComment}
        userVotes={userVotes}
        id={comment.comment_id}
        votes={comment.votes}
      />
    </article>
  );
}
