import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { UserArticleVoteData, UserCommentVoteData, deleteComment } from "../../api";
import { ArticlePreview } from "../Feed/ArticlePreview";
import { Comment, CommentInterface } from "../Article/Comment";
import { ArticleInterface } from "../Article";
import { ArticlesState } from "../Feed";
import { ArticleCommentsState } from "../Article/ArticleComments";

export type GetVotesFunction = {
  (username: string): Promise<UserArticleVoteData[] | UserCommentVoteData[]>
}

export type GetDataFunction = {
  (id: number): Promise<CommentInterface | ArticleInterface>
}

interface UserVotes {
  [key: number]: number
}

interface DataState {
  articles?: ArticleInterface[],
  comments?: CommentInterface[],
  totalCount: number
}

export function InfiniteScrollVotes<VotesFunction extends GetVotesFunction, DataFunction extends GetDataFunction>({
  getVotesFunction,
  getDataFunction,
  username,
  type,
}: {
  getVotesFunction: VotesFunction,
  getDataFunction: DataFunction,
  username: string,
  type: "comments" | "articles"
}) {
  type VoteType = Awaited<ReturnType<VotesFunction>>[0]
  type DataType = Awaited<ReturnType<DataFunction>>
  const getKey = type.slice(0, -1) + '_id' as keyof VoteType

  const { user } = useContext(UserContext);
  const [votes, setVotes] = useState<VoteType[]>([]);
  const [data, setData] = useState<DataState>({totalCount: 0});
  const [renderStart, setRenderStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userVotes, setUserVotes] = useState<UserVotes>({});

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
        const promises: Promise<DataType>[] = []; 
        const slicedVoteData: VoteType[] = voteData.slice(renderStart, renderStart + 6)
        for (const vote of slicedVoteData) {
          promises.push(getDataFunction(+vote[getKey]) as Promise<DataType>);
        }
        return Promise.all(promises);
      })
      .then((newData) => {
        setData((oldDataState): DataState => {
          const currentData = oldDataState.articles || (oldDataState.comments || [])
          const mergedData = [
            ...currentData,
            ...newData.filter((newItem) => {
              return !currentData.find((currentItem) => {
                return currentItem[getKey as keyof typeof currentItem] === newItem[getKey as keyof typeof newItem ];
              });
            }),
          ];
          const output: DataState = {...oldDataState}
          output.totalCount = mergedData.length
          if (type === 'articles') {
            output.articles = mergedData as ArticleInterface[]
            return output
          } else {
            output.comments = mergedData as CommentInterface[]
            return output
          }
        });
        return getVotesFunction(user.username);
      })
      .then((userVoteData) => {
        const newUserVotes: UserVotes = {};
        userVoteData.forEach((vote) => {
          newUserVotes[vote[getKey as keyof typeof vote] as keyof typeof newUserVotes] = vote.votes;
        });
        setUserVotes(newUserVotes);
        setIsLoading(false);
      });
  }, [renderStart]);

  function handleScroll() {
    if (isLoading || data.totalCount === votes.length) return;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight + 100 >= scrollHeight) {
      setRenderStart((start) => start + 6);
    }
  }

  function removeComment(id: number) {
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    deleteComment(id, options).catch((err) => {
      console.log(err);
    });
  }

  if (!Object.keys(userVotes).length) {
    return <span className="loader"></span>;
  }

  if (data.articles && type === 'articles') {
    return (
      <div>
        <ul className="cards cards--liked-articles">
          {data.articles.map((article) => {
            return (
              <li className="article-preview" key={article.article_id}>
                <ArticlePreview
                  userVotes={userVotes[article.article_id as keyof UserVotes]}
                  article={article as ArticleInterface}
                  setArticleData={setData as Dispatch<SetStateAction<ArticlesState>>}
                ></ArticlePreview>
              </li>
            );
          })}
        </ul>
        {isLoading && <span className="loader"></span>}
        {data.totalCount === votes.length && !isLoading && (
          <p className="scroll-end">That's all of them!</p>
        )}
      </div>
    );
  }
  else if (data.comments && type === 'comments') {
    return (
      <>
        <ul className="comments comments--starred-comments">
          {data.comments.map((comment) => {
            return (
              <Comment
                key={comment.comment_id}
                comment={comment}
                removeComment={removeComment}
                setCommentData={setData as Dispatch<SetStateAction<ArticleCommentsState>>}
                userVotes={userVotes[comment.comment_id]}
                showArticleLink
              />
            );
          })}
        </ul>
        {isLoading && <span className="loader"></span>}
        {data.totalCount === votes.length && !isLoading && (
          <p className="scroll-end">That's all of them!</p>
        )}
      </>
    );
  }
}