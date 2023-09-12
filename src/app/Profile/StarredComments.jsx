import { getComment, getUserCommentVotes } from "../../api";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { InfiniteScrollVotes } from "../Reuse/InfiniteScrollVotes";

export function StarredComments({ username }) {
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
