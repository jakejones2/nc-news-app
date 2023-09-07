import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { Link } from "react-router-dom";
import {
  deleteComment,
  getCommentsByArticle,
  getUserCommentVotes,
} from "../../api";
import { Comment } from "./Comment";
import { NewComment } from "./NewComment";

export function Comments({ articleId }) {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [errorLoadingComments, setErrorLoadingComments] = useState(false);
  const [commentVotes, setCommentVotes] = useState({});

  useEffect(() => {
    setIsLoadingComments(true);
    setErrorLoadingComments(false);
    let incomingComments;
    getCommentsByArticle(articleId)
      .then((comments) => {
        setComments(comments);
        return getUserCommentVotes(user.username);
      })
      .then((commentVotes) => {
        const votes = {};
        commentVotes.forEach((comment) => {
          votes[comment.comment_id] = comment.votes;
        });
        setCommentVotes(votes);
        setIsLoadingComments(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorLoadingComments(true);
      });
  }, []);

  function removeComment(id) {
    setErrorLoadingComments(false);
    deleteComment(id).catch((err) => {
      console.log(err);
      setErrorLoadingComments(true);
    });
  }

  if (errorLoadingComments) {
    return (
      <div className="articles-error">
        Can't fetch comments right now - sorry!
      </div>
    );
  }

  if (isLoadingComments) {
    return <span className="loader comment-loader"></span>;
  }

  return (
    <>
      {user.username !== "guest" ? (
        <NewComment setComments={setComments} articleId={articleId} />
      ) : (
        <p className="comments-header">
          <Link to="/login" className="comments-link" id="login">
            Log In
          </Link>{" "}
          or{" "}
          <Link to="/signup" className="comments-link" id="signup">
            Sign Up
          </Link>{" "}
          to post comments
        </p>
      )}
      <ul className="comment-list">
        {comments.map((comment) => {
          return (
            <Comment
              key={comment.comment_id}
              comment={comment}
              removeComment={removeComment}
              setComments={setComments}
              userVotes={commentVotes[comment.comment_id]}
            />
          );
        })}
      </ul>
    </>
  );
}
