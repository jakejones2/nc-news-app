import { useParams } from "react-router-dom";
import { UserData } from "./Profile/UserData";
import { ItemDropDown } from "./Reuse/ItemDropDown";
import { UserArticles } from "./Profile/UserArticles";
import { UserComments } from "./Profile/UserComments";
import { InfiniteScrollVotes } from "./Reuse/InfiniteScrollVotes";
import {
  getArticle,
  getComment,
  getUserArticleVotes,
  getUserCommentVotes,
} from "../api";
import { StarredArticles } from "./Profile/StarredArticles";
import { StarredComments } from "./Profile/StarredComments";

export function Profile() {
  const { username } = useParams();

  return (
    <>
      <UserData username={username} />
      <UserArticles username={username} />
      <UserComments username={username} />
      <StarredArticles username={username} />
      <StarredComments username={username} />
    </>
  );
}
