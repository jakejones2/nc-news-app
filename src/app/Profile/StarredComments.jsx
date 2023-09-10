import {
  getArticle,
  getComment,
  getUserArticleVotes,
  getUserCommentVotes,
} from "../../api";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { InfiniteScrollVotes } from "../Reuse/InfiniteScrollVotes";
import { useState } from "react";

export function StarredComments({ username }) {
  const [votes, setVotes] = useState([]);
  const [renderStart, setRenderStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    <ItemDropDown image="../../../comments.png" header="Starred Comments">
      <InfiniteScrollVotes
        getVotesFunction={getUserCommentVotes}
        getDataFunction={getComment}
        getKey={"comment_id"}
        username={username}
        type="comments"
      />
    </ItemDropDown>
  );
}
