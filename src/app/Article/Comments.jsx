import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { deleteComment, getUserCommentVotes } from "../../api";
import { Comment } from "./Comment";

export function Comments({
  getFunction,
  getKey,
  getQueries,
  setQueries,
  commentData,
  setCommentData,
  showArticleLinks,
  setUseInfiniteScroll,
  useInfiniteScroll,
  useManualScroll,
}) {
  const { user } = useContext(UserContext);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [errorLoadingComments, setErrorLoadingComments] = useState(false);
  const [noComments, setNoComments] = useState(false);
  const [commentVotes, setCommentVotes] = useState({});
  const [isLoadingAllComments, setIsLoadingAllComments] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [getQueries, commentData, commentVotes]);

  useEffect(() => {
    setIsLoadingComments(true);
    setErrorLoadingComments(false);
    if (!useInfiniteScroll) setIsLoadingAllComments(true);
    getFunction(getKey, getQueries)
      .then((commentData) => {
        if (useInfiniteScroll) {
          setCommentData((current) => {
            return {
              totalCount: commentData.totalCount,
              comments: [
                ...current.comments,
                ...commentData.comments.filter((newComment) => {
                  const match = current.comments.find((currentComment) => {
                    return currentComment.comment_id === newComment.comment_id;
                  });
                  return !match;
                }),
              ],
            };
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
        setIsLoadingAllComments(false);
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
    setUseInfiniteScroll(false);
  }, [getQueries.order, getQueries.sortBy]);

  function removeComment(id) {
    setErrorLoadingComments(false);
    const options = { headers: { Authorization: `Bearer ${user.token}` } };
    deleteComment(id, options).catch((err) => {
      console.log(err);
      setErrorLoadingComments(true);
    });
  }

  function handleScroll() {
    if (isLoadingComments || useManualScroll) return;
    if (commentData.comments.length === commentData.totalCount) return;
    const { limit, page } = getQueries;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setUseInfiniteScroll(true);
      setQueries((current) => {
        const newQueries = { ...current };
        newQueries.page = Math.floor(commentData.comments.length / limit) + 1;
        return newQueries;
      });
    }
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

  if (isLoadingAllComments) {
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
      {isLoadingComments && <span className="loader comment-loader"></span>}
      {commentData.comments.length >= commentData.totalCount &&
        !isLoadingComments && (
          <p className="infinite-scroll-end">That's all of them!</p>
        )}
    </>
  );
}
