import { useState } from "react";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { Filters } from "../Reuse/Filters";
import { FilterOptions } from "../Reuse/FilterOptions";
import { InfiniteScroll } from "../Reuse/InfiniteScroll";
import { getCommentsByUser } from "../../api";
import { Comments } from "../Article/Comments";

export function UserComments({ username }) {
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
  const [scrollType, setScrollType] = useState("infinite");

  return (
    <ItemDropDown image="../../../comments.png" header="Comments">
      <Filters
        queries={commentQueries}
        setQueries={setCommentQueries}
        isLoading={isLoadingComments}
        totalCount={commentData.length}
        scrollType={scrollType}
        setScrollType={setScrollType}
        type="user-comments"
      >
        <FilterOptions
          queries={commentQueries}
          setQueries={setCommentQueries}
          type="user-comments"
        />
      </Filters>
      <InfiniteScroll
        isLoading={isLoadingComments}
        data={commentData}
        dataKey="comments"
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
          getFunction={getCommentsByUser}
          getKey={username}
          getQueries={commentQueries}
          scrollType={scrollType}
          setScrollType={setScrollType}
          showArticleLinks
        />
      </InfiniteScroll>
    </ItemDropDown>
  );
}
