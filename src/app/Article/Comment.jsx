import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts";
import { patchComment } from "../../api";
import { Star } from "../Reuse/Star";
import { ConfirmationModal } from "../Reuse/ConfirmationModal";

export function Comment({
  setCommentData,
  comment,
  removeComment,
  userVotes,
  showArticleLink,
}) {
  const { user } = useContext(UserContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleCommentDelete() {
    setCommentData(({ comments }) => {
      return {
        comments: comments.filter((item) => {
          return item.comment_id !== comment.comment_id;
        }),
      };
    });
    removeComment(comment.comment_id);
    // need to do this properly - what if delete fails?
    // need an error message state etc.
  }

  return (
    <article className="comment">
      <div className="comment-info">
        <Link to={`/profile/${comment.author}`} className="article-link">
          <h4 className="comment-author">{comment.author}</h4>
        </Link>
        <p className="comment-datetime">
          {showArticleLink && (
            <span>
              <Link
                to={`/article/${comment.article_id}`}
                className="article-link"
              >
                Go To Article
              </Link>
              <span> | </span>
            </span>
          )}
          {new Date(comment.created_at).toDateString()}
        </p>
      </div>
      <p className="comment-body">{comment.body}</p>
      {user.username === comment.author ? (
        <img
          onClick={() => {
            setShowDeleteModal(true);
          }}
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
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this comment? You cannot get it back!"
          setShowState={setShowDeleteModal}
          confirmFunction={handleCommentDelete}
          args={[]}
        />
      )}
    </article>
  );
}
