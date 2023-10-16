import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserContext } from "../../contexts";
import { Query, deleteComment, getUserCommentVotes } from "../../api";
import { Comment, CommentInterface } from "./Comment";
import { appendInfiniteScrollData } from "../Reuse/InfiniteScroll";
import { ArticleCommentsState } from "./ArticleComments";
import { ScrollOptions } from "../Reuse/Filters";

export type GetCommentsFunction = {
  (key: number | string, query: Query): Promise<ArticleCommentsState>;
};

export type RemoveCommentFunction = {
  (id: number): void;
};

export interface UserCommentVotes {
  [comment_id: number]: number;
}

export function Comments({
  commentData,
  setCommentData,
  isLoadingComments,
  setIsLoadingComments,
  getFunction,
  getKey,
  getQueries,
  scrollType,
  setScrollType,
  showArticleLinks,
  emptyMsg = "Be the first to comment on this post!",
}: {
  commentData: ArticleCommentsState;
  setCommentData: Dispatch<SetStateAction<ArticleCommentsState>>;
  isLoadingComments: boolean;
  setIsLoadingComments: Dispatch<SetStateAction<boolean>>;
  getFunction: GetCommentsFunction;
  getKey: number | string;
  getQueries: Query;
  scrollType: ScrollOptions;
  setScrollType: Dispatch<SetStateAction<ScrollOptions>>;
  showArticleLinks: boolean;
  emptyMsg?: string;
}) {
  const { user } = useContext(UserContext);
  const [errorLoadingComments, setErrorLoadingComments] = useState(false);
  const [noComments, setNoComments] = useState(false);
  const [commentVotes, setCommentVotes] = useState<UserCommentVotes>({});

  useEffect(() => {
    setIsLoadingComments(true);
    setErrorLoadingComments(false);
    getFunction(getKey, getQueries)
      .then((commentData) => {
        console.log("raw", commentData);
        if (scrollType === "infinite") {
          setCommentData((current): ArticleCommentsState => {
            return {
              totalCount: commentData.totalCount,
              comments: appendInfiniteScrollData<CommentInterface>(
                current.comments,
                commentData.comments,
              ),
            };
          });
        } else setCommentData(commentData);
        return getUserCommentVotes(user.username);
      })
      .then((commentVotes) => {
        const votes: UserCommentVotes = {};
        commentVotes.forEach((comment) => {
          votes[comment.comment_id] = comment.votes;
        });
        setCommentVotes(votes);
        setIsLoadingComments(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingComments(false);
        if (err.response.status === 404) {
          setNoComments(true);
        } else {
          setErrorLoadingComments(true);
        }
      });
  }, [getQueries]);

  useEffect(() => {
    setCommentData(() => {
      return { totalCount: 0, comments: [] };
    });
    if (scrollType === "infinite") setScrollType("");
  }, [getQueries.order, getQueries.sortBy]);

  function removeComment(id: number): void {
    setErrorLoadingComments(false);
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    deleteComment(id, options).catch((err) => {
      console.log(err);
      setErrorLoadingComments(true);
    });
  }

  if (noComments) {
    return <div className="error error--no-comments">{emptyMsg}</div>;
  }

  if (errorLoadingComments) {
    return <div className="error">Can't fetch comments right now - sorry!</div>;
  }

  if (isLoadingComments && scrollType !== "infinite") {
    return <span className="loader loader--comment"></span>;
  }

  return (
    <>
      <ul className="comments">
        {commentData.comments.map((comment) => {
          return (
            <Comment
              key={comment.comment_id}
              comment={comment}
              removeComment={removeComment}
              setCommentData={setCommentData}
              userVotes={commentVotes[comment.comment_id]}
              showArticleLink={showArticleLinks}
            />
          );
        })}
      </ul>
    </>
  );
}
