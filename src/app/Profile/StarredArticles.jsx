import { getArticle, getUserArticleVotes } from "../../api";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { InfiniteScrollVotes } from "../Reuse/InfiniteScrollVotes";

export function StarredArticles({ username }) {
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
