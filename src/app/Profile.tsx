import { useParams } from "react-router-dom";
import { UserData } from "./Profile/UserData";
import { UserArticles } from "./Profile/UserArticles";
import { UserComments } from "./Profile/UserComments";
import { StarredArticles } from "./Profile/StarredArticles";
import { StarredComments } from "./Profile/StarredComments";

export function Profile() {
  const { username = "guest" } = useParams();

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
