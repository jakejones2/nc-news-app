import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { deleteComment, getUserCommentVotes } from "../../api";
import { Comment } from "./Comment";
import { appendInfiniteScrollData } from "../Reuse/InfiniteScroll";

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
}) {
  const { user } = useContext(UserContext);
  const [errorLoadingComments, setErrorLoadingComments] = useState(false);
  const [noComments, setNoComments] = useState(false);
  const [commentVotes, setCommentVotes] = useState({});

  useEffect(() => {
    setIsLoadingComments(true);
    setErrorLoadingComments(false);
    getFunction(getKey, getQueries)
      .then((commentData) => {
        if (scrollType === "infinite") {
          setCommentData((current) => {
            return appendInfiniteScrollData(
              current,
              commentData,
              "comments",
              "comment_id"
            );
          });
        } else setCommentData(commentData);
        return getUserCommentVotes(user.username);
      })
      .then((commentVotes) => {
        const votes = {};
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

  function removeComment(id) {
    setErrorLoadingComments(false);
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    deleteComment(id, options).catch((err) => {
      console.log(err);
      setErrorLoadingComments(true);
    });
  }

  if (noComments) {
    return (
      <div className="articles-error no-comments">
        Be the first to comment on this post!
      </div>
    );
  }

  if (errorLoadingComments) {
    return (
      <div className="articles-error">
        Can't fetch comments right now - sorry!
      </div>
    );
  }

  if (isLoadingComments && scrollType !== "infinite") {
    return <span className="loader comment-loader"></span>;
  }

  return (
    <>
      <ul className="comment-list">
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
