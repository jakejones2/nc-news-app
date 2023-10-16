import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { postComment } from "../../api";
import { ArticleCommentsState } from "./ArticleComments";

export interface NewCommentInterface {
  body: string,
  username: string
}

export function NewComment({ setCommentData, articleId }: {
  setCommentData: Dispatch<SetStateAction<ArticleCommentsState>>, 
  articleId: number
}) {
  const [commentBody, setCommentBody] = useState("");
  const { setUser, user } = useContext(UserContext);
  const [errorPostingComment, setErrorPostingComments] = useState(false);

  function handleCommentBody(event: ChangeEvent<HTMLTextAreaElement>) {
    setCommentBody(event.target.value);
  }

  function removeLastComment() {
    setCommentData((commentData) => {
      return {
        totalCount: commentData.totalCount - 1,
        comments: commentData.comments.filter((comment) => {
          return comment.comment_id < commentData.totalCount - 1;
        }),
      };
    });
  }

  function handleCommentForm(event: FormEvent<HTMLFormElement>) {
    setErrorPostingComments(false);
    event.preventDefault();
    setCommentData((commentData) => {
      const newComment = {
        comment_id: commentData.totalCount + 1,
        body: commentBody,
        article_id: articleId,
        author: user.username,
        votes: 0,
        created_at: new Date().toISOString(),
      };
      return { 
        totalCount: commentData.totalCount + 1, 
        comments: [newComment, ...commentData.comments] 
      };
    });
    const newComment: NewCommentInterface = {
      body: commentBody,
      username: user.username,
    };
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    postComment(articleId, newComment, options).catch((err) => {
      if (err.response.status === 403) {
        logoutUser(setUser);
        removeLastComment();
      } else {
        console.log(err);
        setErrorPostingComments(true);
        removeLastComment();
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
