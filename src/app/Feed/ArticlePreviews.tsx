import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { getArticles, getTopic, getUserArticleVotes } from "../../api";
import { ArticlePreview } from "./ArticlePreview";
import { Topic } from "../Article/Topic";
import { appendInfiniteScrollData } from "../Reuse/InfiniteScroll";

export function ArticlePreviews({
  articleData,
  setArticleData,
  setIsLoadingArticles,
  isLoadingArticles,
  queries,
  setQueries,
  scrollType,
  setScrollType,
}) {
  const { user } = useContext(UserContext);
  const [errorLoadingArticles, setErrorLoadingArticles] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [articleVotes, setArticleVotes] = useState({});

  useEffect(() => {
    setIsLoadingArticles(true);
    setErrorLoadingArticles(false);
    setTopicDescription("");
    if (queries.topic) {
      getTopic(queries.topic).then((description) => {
        setTopicDescription(description);
      });
    }
    getArticles(queries)
      .then((articleData) => {
        if (scrollType === "infinite") {
          setArticleData((current) => {
            return appendInfiniteScrollData(
              current,
              articleData,
              "articles",
              "article_id"
            );
          });
        } else setArticleData(articleData);
        return getUserArticleVotes(user.username);
      })
      .then((articleVotes) => {
        const votes = {};
        articleVotes.forEach((vote) => {
          votes[vote.article_id] = vote.votes;
        });
        setArticleVotes(votes);
        setIsLoadingArticles(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          setErrorLoadingArticles("This article doesn't exist yet...");
        } else {
          setErrorLoadingArticles("Can't fetch articles right now - sorry!");
        }
      });
  }, [queries]);

  useEffect(() => {
    setArticleData(() => {
      return { totalCount: 0, articles: [] };
    });
    if (scrollType === "infinite") setScrollType("");
  }, [queries.order, queries.sortBy, queries.topic]);

  if (errorLoadingArticles) {
    return <div className="error">{errorLoadingArticles}</div>;
  }

  if (isLoadingArticles && scrollType !== "infinite") {
    return <span className="loader"></span>;
  }

  return (
    <>
      {topicDescription && (
        <div className="community">
          <span className="community__header">
            Welcome to the <Topic topic={queries.topic} type="inline" />{" "}
            community!
          </span>
          <p className="community__description">{topicDescription}</p>
        </div>
      )}
      <p className="total-articles">
        Showing{" "}
        {scrollType === "infinite" ? 1 : 1 + (queries.page - 1) * queries.limit}
        -
        {articleData.totalCount < queries.page * queries.limit
          ? articleData.totalCount
          : queries.page * queries.limit}{" "}
        of {articleData.totalCount}
      </p>
      <ul className="cards">
        {articleData.articles.map((article) => {
          return (
            <li className="article-preview" key={article.article_id}>
              <ArticlePreview
                userVotes={articleVotes[article.article_id]}
                article={article}
                articleData={articleData}
                setArticleData={setArticleData}
                setQueries={setQueries}
              ></ArticlePreview>
            </li>
          );
        })}
      </ul>
    </>
  );
}
