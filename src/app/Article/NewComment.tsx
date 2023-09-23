import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { postComment, tryAgainWithRefresh } from "../../api";

export function NewComment({ setCommentData, articleId }) {
  const [commentBody, setCommentBody] = useState("");
  const { setUser, user } = useContext(UserContext);
  const [errorPostingComment, setErrorPostingComments] = useState(false);

  function handleCommentBody(event) {
    setCommentBody(event.target.value);
  }

  function removeLastComment() {
    setCommentData(({ comments }) => {
      return {
        comments: comments.filter((comment) => {
          return comment.comment_id < comments.length - 1;
        }),
      };
    });
  }

  function handleCommentForm(event) {
    setErrorPostingComments(false);
    event.preventDefault();
    setCommentData(({ comments }) => {
      const newComment = {
        comment_id: comments.length + 1,
        body: commentBody,
        article_id: articleId,
        author: user.username,
        votes: 0,
        created_at: new Date(),
      };
      return { comments: [newComment, ...comments] };
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
    <div>
      <h3 className="post-comment-title">Have your say!</h3>
      <form className="comment-form" onSubmit={handleCommentForm}>
        <textarea
          id="body"
          className="comment-form__body"
          value={commentBody}
          placeholder="What do you think of this article?"
          onChange={handleCommentBody}
        ></textarea>
        <button disabled={!commentBody} className="comment-form__button">
          Post Comment
        </button>
        {errorPostingComment && (
          <p className="error error--post-comment">
            Can't post comments right now - sorry!
          </p>
        )}
      </form>
    </div>
  );
}
