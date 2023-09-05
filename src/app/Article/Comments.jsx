import { useContext, useEffect, useState } from "react";
import { getCommentsByArticle } from "../../api";
import { Comment } from "./Comment";

export function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [errorLoadingComments, setErrorLoadingComments] = useState(false);

  useEffect(() => {
    setIsLoadingComments(true);
    setErrorLoadingComments(false);
    getCommentsByArticle(articleId)
      .then((comments) => {
        setComments(comments);
        setIsLoadingComments(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorLoadingComments(true);
      });
  }, []);

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
    <ul className="comment-list">
      {comments.map((comment) => {
        return <Comment key={comment.comment_id} comment={comment} />;
      })}
    </ul>
  );
}
