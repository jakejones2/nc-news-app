import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { deleteComment, getUserCommentVotes } from "../../api";
import { Comment } from "./Comment";

export function Comments({ getFunction, getKey, comments, setComments }) {
  const { user } = useContext(UserContext);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [errorLoadingComments, setErrorLoadingComments] = useState(false);
  const [noComments, setNoComments] = useState(false);
  const [commentVotes, setCommentVotes] = useState({});

  useEffect(() => {
    setIsLoadingComments(true);
    setErrorLoadingComments(false);
    getFunction(getKey)
      .then((commentData) => {
        setComments(commentData);
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
        if (err.response.status === 404) {
          setNoComments(true);
        } else {
          setErrorLoadingComments(true);
        }
      });
  }, []);

  function removeComment(id) {
    setErrorLoadingComments(false);
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    deleteComment(id, options).catch((err) => {
      console.log(err);
      setErrorLoadingComments(true);
    });
  }

  if (noComments) {
    return (
      <div className="articles-error no-comments">
        Be the first to comment on this post!
      </div>
    );
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
