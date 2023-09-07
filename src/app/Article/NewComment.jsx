import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { postComment, tryAgainWithRefresh } from "../../api";

export function NewComment({ setComments, articleId }) {
  const [commentBody, setCommentBody] = useState("");
  const { setUser, user } = useContext(UserContext);
  const [errorPostingComment, setErrorPostingComments] = useState(false);

  function handleCommentBody(event) {
    setCommentBody(event.target.value);
  }

  function removeLastComment() {
    setComments((comments) => {
      return comments.filter((comment) => {
        return comment.comment_id < comments.length - 1;
      });
    });
  }

  function handleCommentForm(event) {
    setErrorPostingComments(false);
    event.preventDefault();
    setComments((comments) => {
      const newComment = {
        comment_id: comments.length + 1,
        body: commentBody,
        article_id: articleId,
        author: user.username,
        votes: 0,
        created_at: new Date(),
      };
      return [newComment, ...comments];
    });
    const newComment = {
      body: commentBody,
      username: user.username,
    };
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    postComment(articleId, newComment, options).catch((err) => {
      if (err.response.status === "403 once refresh tokens are working") {
        tryAgainWithRefresh(postComment, setUser, articleId, newComment).catch(
          (err) => {
            if (err.response.status === 403) {
              logoutUser();
              removeLastComment();
            } else {
              console.log(err);
              setErrorPostingComments(true);
              removeLastComment();
            }
          }
        );
      } else {
        if (err.response.status === 403) {
          logoutUser(setUser);
          removeLastComment();
        } else {
          console.log(err);
          setErrorPostingComments(true);
          removeLastComment();
        }
      }
    });
  }

  return (
    <form id="new-comment-form" onSubmit={handleCommentForm}>
      <textarea
        id="body"
        className="input-body"
        value={commentBody}
        placeholder="Have your say!"
        onChange={handleCommentBody}
      ></textarea>
      <button className="submit-button">Post Comment</button>
      {errorPostingComment && (
        <p className="articles-error post-comment-error">
          Can't post comments right now - sorry!
        </p>
      )}
    </form>
  );
}
