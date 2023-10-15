import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts";
import { patchComment } from "../../api";
import { Star } from "../Reuse/Star";
import { ConfirmationModal } from "../Reuse/ConfirmationModal";
import { ArticleCommentsState } from "./ArticleComments";
import { RemoveCommentFunction, UserCommentVotes } from "./Comments";

export interface CommentInterface {
  comment_id: number,
  author: string,
  article_id: number,
  body: string,
  votes: number,
  created_at: string
}

export function Comment({
  setCommentData,
  comment,
  removeComment,
  userVotes,
  showArticleLink,
}: {
  setCommentData: React.Dispatch<React.SetStateAction<ArticleCommentsState>>,
  comment: CommentInterface,
  removeComment: RemoveCommentFunction,
  userVotes: number,
  showArticleLink: boolean 
}) {
  const { user } = useContext(UserContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleCommentDelete() {
    setCommentData(({ comments, totalCount }) => {
      return {
        totalCount: totalCount--,
        comments: comments.filter((item) => {
          return item.comment_id !== comment.comment_id;
        }),
      };
    });
    removeComment(comment.comment_id);
    // need to finish this - what if delete fails?
    // need an error state and message. reincrement total count etc.
  }

  return (
    <article className="comment">
      <div className="comment__info">
        <Link to={`/profile/${comment.author}`}>
          <h4 className="comment__author">{comment.author}</h4>
        </Link>
        <p className="comment__datetime">
          {showArticleLink && (
            <span>
              <Link to={`/article/${comment.article_id}`}>Go To Article</Link>
              <span> | </span>
            </span>
          )}
          {new Date(comment.created_at).toDateString()}
        </p>
      </div>
      <p className="comment__body">{comment.body}</p>
      {user.username === comment.author ? (
        <img
          onClick={() => {
            setShowDeleteModal(true);
          }}
          src="../../../bin.png"
          className="comment__logo bin bin--comment"
          alt="delete comment"
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
