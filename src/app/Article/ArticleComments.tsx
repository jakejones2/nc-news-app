import { useContext, useState } from "react";
import { UserContext } from "../../contexts";
import { Link } from "react-router-dom";
import { Comments } from "./Comments";
import { NewComment } from "./NewComment";
import { Query, getCommentsByArticle } from "../../api";
import { Filters, ScrollTypeType } from "../Reuse/Filters";
import { FilterOptions } from "../Reuse/FilterOptions";
import { InfiniteScroll } from "../Reuse/InfiniteScroll";
import { CommentInterface } from "./Comment";

export interface ArticleCommentsState {
  comments: CommentInterface[]
  totalCount: number
}

export function ArticleComments({articleId}: {articleId: number}) {
  const user = useContext(UserContext)?.user;
  const [commentData, setCommentData] = useState<ArticleCommentsState>({
    comments: [],
    totalCount: 0,
  });
  const [commentQueries, setCommentQueries] = useState<Query>({
    page: 1,
    limit: 10,
    sortBy: "votes",
    order: "desc",
  });
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [scrollType, setScrollType] = useState<ScrollTypeType>("");
  return (
    <div className="article-comments">
      {user?.username !== "guest" ? (
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
          showArticleLinks={false}
        />
      </InfiniteScroll>
    </div>
  );
}
