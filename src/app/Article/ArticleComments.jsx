import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { Link } from "react-router-dom";
import { Comments } from "./Comments";
import { NewComment } from "./NewComment";
import { getCommentsByArticle } from "../../api";
import { Filters } from "../Feed/Filters";

export function ArticleComments({ articleId }) {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState({ comments: [], commentCount: 0 });
  const [commentQueries, setCommentQueries] = useState({
    page: 1,
    limit: 10,
    sort_by: "votes",
  });

  return (
    <div id="article-comments">
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
      <div className="article-existing-comments">
        <Filters
          queries={commentQueries}
          setQueries={setCommentQueries}
          totalCount={comments.totalCount}
          type="comments"
        />
        <Comments
          getFunction={getCommentsByArticle}
          getKey={articleId}
          getQueries={commentQueries}
          setQueries={setCommentQueries}
          commentData={comments}
          setComments={setComments}
        />
      </div>
    </div>
  );
}
