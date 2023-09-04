import { useContext, useEffect, useState } from "react";
import { getCommentsByArticle } from "../../api";
import { Comment } from "./Comment";

export function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    setIsLoadingComments(true);
    getCommentsByArticle(articleId).then((comments) => {
      setComments(comments);
      setIsLoadingComments(false);
    });
  }, []);

  if (isLoadingComments) {
    return <span className="loader comment-loader"></span>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => {
        return <Comment comment={comment} />;
      })}
    </ul>
  );
}
