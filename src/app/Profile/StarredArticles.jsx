import { getArticle, getUserArticleVotes } from "../../api";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { InfiniteScrollVotes } from "../Reuse/InfiniteScrollVotes";
import { useState } from "react";

export function StarredArticles({ username }) {
  const [votes, setVotes] = useState([]);
  const [renderStart, setRenderStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    <ItemDropDown image="../../../book.png" header="Starred Articles">
      <InfiniteScrollVotes
        getVotesFunction={getUserArticleVotes}
        getDataFunction={getArticle}
        getKey={"article_id"}
        username={username}
        type="articles"
      />
    </ItemDropDown>
  );
}
