import { getComment, getUserCommentVotes } from "../../api";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { InfiniteScrollVotes } from "../Reuse/InfiniteScrollVotes";

export function StarredComments({ username }: {username: string}) {
  return (
    <ItemDropDown image="../../../comments.png" header="Starred Comments">
      <div className='profile-comments'>
        <InfiniteScrollVotes
          getVotesFunction={getUserCommentVotes}
          getDataFunction={getComment}
          username={username}
          type="comments"
        />
      </div>
    </ItemDropDown>
  );
}
