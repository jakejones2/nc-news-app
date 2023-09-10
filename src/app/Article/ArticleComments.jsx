import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { Link } from "react-router-dom";
import { Comments } from "./Comments";
import { NewComment } from "./NewComment";
import { getCommentsByArticle } from "../../api";
import { Filters } from "../Reuse/Filters";
import { FilterOptions } from "../Reuse/FilterOptions";

export function ArticleComments({ articleId }) {
  const { user } = useContext(UserContext);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [useManualScroll, setUseManualScroll] = useState(false);
  const [commentData, setCommentData] = useState({
    comments: [],
    totalCount: 0,
  });
  const [commentQueries, setCommentQueries] = useState({
    page: 1,
    limit: 10,
    sort_by: "votes",
    order: "desc",
  });

  return (
    <div id="article-comments">
      {user.username !== "guest" ? (
        <NewComment setCommentData={setCommentData} articleId={articleId} />
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
          totalCount={commentData.totalCount}
          type="comments"
          useInfiniteScroll={useInfiniteScroll}
          setUseManualScroll={setUseManualScroll}
        >
          <FilterOptions
            queries={commentQueries}
            setQueries={setCommentQueries}
            type={"comments"}
          />
        </Filters>
        <Comments
          getFunction={getCommentsByArticle}
          getKey={articleId}
          getQueries={commentQueries}
          setQueries={setCommentQueries}
          commentData={commentData}
          setCommentData={setCommentData}
          useInfiniteScroll={useInfiniteScroll}
          setUseInfiniteScroll={setUseInfiniteScroll}
          useManualScroll={useManualScroll}
        />
      </div>
    </div>
  );
}
