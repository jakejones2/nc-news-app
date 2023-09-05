import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { postComment } from "../../api";

export function NewComment({ setComments, articleId }) {
  const [commentBody, setCommentBody] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [errorPostingComment, setErrorPostingComments] = useState(false);

  function handleCommentBody(event) {
    setCommentBody(event.target.value);
  }

  function handleCommentForm(event) {
    setErrorPostingComments(false);
    event.preventDefault();
    setComments((comments) => {
      const newComment = {
        comment_id: comments.length + 1,
        body: commentBody,
        article_id: articleId,
        author: user,
        votes: 0,
        created_at: new Date(),
      };
      return [newComment, ...comments];
    });
    const newComment = {
      body: commentBody,
      username: user,
    };
    postComment(articleId, newComment).catch(() => {
      setErrorPostingComments(true);
      setComments((comments) => {
        return comments.filter((comment) => {
          return comment.comment_id < comments.length;
        });
      });
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
