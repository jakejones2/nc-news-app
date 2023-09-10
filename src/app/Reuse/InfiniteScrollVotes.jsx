import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { deleteComment } from "../../api";
import { ArticlePreview } from "../Feed/ArticlePreview";
import { Comment } from "../Article/Comment";

export function InfiniteScrollVotes({
  getVotesFunction,
  getDataFunction,
  getKey,
  username,
  type,
}) {
  const { user } = useContext(UserContext);
  const [votes, setVotes] = useState([]);
  const [renderStart, setRenderStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchmove", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [data, isLoading]);

  useEffect(() => {
    setIsLoading(true);
    getVotesFunction(username)
      .then((voteData) => {
        setVotes(voteData);
        const promises = [];
        for (const vote of voteData.slice(renderStart, renderStart + 6)) {
          promises.push(getDataFunction(vote[getKey]));
        }
        return Promise.all(promises);
      })
      .then((newData) => {
        setData((currentData) => {
          return [
            ...currentData,
            ...newData.filter((newItem) => {
              return !currentData.find((currentItem) => {
                return currentItem[getKey] === newItem[getKey];
              });
            }),
          ];
        });
        return getVotesFunction(user.username);
      })
      .then((userVoteData) => {
        const newUserVotes = {};
        userVoteData.forEach((vote) => {
          newUserVotes[vote[getKey]] = vote.votes;
        });
        setUserVotes(newUserVotes);
        setIsLoading(false);
      });
  }, [renderStart]);

  function handleScroll() {
    if (isLoading || data.length === votes.length) return;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight + 100 >= scrollHeight) {
      setRenderStart((start) => start + 6);
    }
  }

  if (!Object.keys(userVotes).length) {
    return <span className="loader"></span>;
  }

  if (type === "articles") {
    return (
      <div>
        <ul className="cards liked-articles">
          {data.map((article) => {
            return (
              <li className="article-preview" key={article.article_id}>
                <ArticlePreview
                  userVotes={userVotes[article.article_id]}
                  article={article}
                  setArticles={setData}
                ></ArticlePreview>
              </li>
            );
          })}
        </ul>
        {isLoading && <span className="loader"></span>}
        {data.length === votes.length && !isLoading && (
          <p className="infinite-scroll-end">That's all of them!</p>
        )}
      </div>
    );
  }

  function removeComment(id) {
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    deleteComment(id, options).catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      <ul className="comment-list starred-comments">
        {data.map((comment) => {
          console.log(userVotes[comment.comment_id]);
          return (
            <Comment
              key={comment.comment_id}
              comment={comment}
              removeComment={removeComment}
              setCommentData={setData}
              userVotes={userVotes[comment.comment_id]}
              showArticleLink
            />
          );
        })}
      </ul>
      {isLoading && <span className="loader"></span>}
      {data.length === votes.length && !isLoading && (
        <p className="infinite-scroll-end">That's all of them!</p>
      )}
    </>
  );
}
