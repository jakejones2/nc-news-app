import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { Link } from "react-router-dom";
import { Comments } from "./Comments";
import { NewComment } from "./NewComment";
import { getCommentsByArticle } from "../../api";

export function ArticleComments({ articleId }) {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);

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
      <Comments
        getFunction={getCommentsByArticle}
        getKey={articleId}
        comments={comments}
        setComments={setComments}
      />
    </>
  );
}
