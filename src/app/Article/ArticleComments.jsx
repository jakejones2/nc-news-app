import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { Link } from "react-router-dom";
import { Comments } from "./Comments";
import { NewComment } from "./NewComment";
import { getCommentsByArticle } from "../../api";
import { Filters } from "../Reuse/Filters";
import { FilterOptions } from "../Reuse/FilterOptions";
import { InfiniteScroll } from "../Reuse/InfiniteScroll";

export function ArticleComments({ articleId }) {
  const { user } = useContext(UserContext);
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
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [scrollType, setScrollType] = useState("");
  return (
    <div className="article-comments">
      {user.username !== "guest" ? (
        <NewComment setCommentData={setCommentData} articleId={articleId} />
      ) : (
        <p className="article-comments__header">
          <Link to="/login" className="article-comments__link" id="login">
            Log In
          </Link>{" "}
          or{" "}
          <Link to="/signup" className="article-comments__link" id="signup">
            Sign Up
          </Link>{" "}
          to post comments
        </p>
      )}

      <Filters
        queries={commentQueries}
        setQueries={setCommentQueries}
        totalCount={commentData.totalCount}
        type="comments"
        isLoading={isLoadingComments}
        scrollType={scrollType}
        setScrollType={setScrollType}
      >
        <FilterOptions
          queries={commentQueries}
          setQueries={setCommentQueries}
          type={"comments"}
        />
      </Filters>
      <InfiniteScroll
        isLoading={isLoadingComments}
        data={commentData}
        dataKey={"comments"}
        getQueries={commentQueries}
        setQueries={setCommentQueries}
        scrollType={scrollType}
        setScrollType={setScrollType}
      >
        <Comments
          commentData={commentData}
          setCommentData={setCommentData}
          isLoadingComments={isLoadingComments}
          setIsLoadingComments={setIsLoadingComments}
          getFunction={getCommentsByArticle}
          getKey={articleId}
          getQueries={commentQueries}
          scrollType={scrollType}
          setScrollType={setScrollType}
        />
      </InfiniteScroll>
    </div>
  );
}
