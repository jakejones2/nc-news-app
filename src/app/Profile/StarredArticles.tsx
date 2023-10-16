import { getArticle, getUserArticleVotes } from "../../api";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { InfiniteScrollVotes } from "../Reuse/InfiniteScrollVotes";

export function StarredArticles({ username }: {username: string}) {
  return (
    <ItemDropDown image="../../../book.png" header="Starred Articles">
        <InfiniteScrollVotes
          getVotesFunction={getUserArticleVotes}
          getDataFunction={getArticle}
          username={username}
          type="articles"
        />
    </ItemDropDown>
  );
}
