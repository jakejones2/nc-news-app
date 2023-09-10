import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { getArticles, getTopic, getUserArticleVotes } from "../../api";
import { ArticlePreview } from "./ArticlePreview";
import { Topic } from "../Article/Topic";

export function ArticlePreviews({
  articleData,
  setArticleData,
  isLoadingArticles,
  setIsLoadingArticles,
  queries,
  setQueries,
  useInfiniteScroll,
  setUseInfiniteScroll,
  useManualScroll,
}) {
  const { user } = useContext(UserContext);
  const [errorLoadingArticles, setErrorLoadingArticles] = useState("");
  const [articleVotes, setArticleVotes] = useState({});
  const [topicDescription, setTopicDescription] = useState("");
  const [isLoadingAllArticles, setIsLoadingAllArticles] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [queries, articleData, articleVotes]);

  useEffect(() => {
    setIsLoadingArticles(true);
    setErrorLoadingArticles(false);
    setTopicDescription("");
    if (!useInfiniteScroll) setIsLoadingAllArticles(true);
    if (queries.topic) {
      getTopic(queries.topic).then((description) => {
        setTopicDescription(description);
      });
    }
    getArticles(queries)
      .then((articleData) => {
        if (useInfiniteScroll) {
          setArticleData((current) => {
            return {
              totalCount: articleData.totalCount,
              articles: [
                ...current.articles,
                ...articleData.articles.filter((newArticle) => {
                  const match = current.articles.find((currentArticle) => {
                    return currentArticle.article_id === newArticle.article_id;
                  });
                  return !match;
                }),
              ],
            };
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
        setIsLoadingAllArticles(false);
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
    setUseInfiniteScroll(false);
  }, [queries.order, queries.sortBy]);

  function handleScroll() {
    if (isLoadingArticles || useManualScroll) return;
    if (articleData.articles.length === articleData.totalCount) return;
    const { limit, page } = queries;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setUseInfiniteScroll(true);
      setQueries((current) => {
        const newQueries = { ...current };
        newQueries.page = Math.floor(articleData.articles.length / limit) + 1;
        return newQueries;
      });
    }
  }

  if (errorLoadingArticles) {
    return <div className="articles-error">{errorLoadingArticles}</div>;
  }

  if (isLoadingAllArticles) {
    return <span className="loader"></span>;
  }

  return (
    <>
      {topicDescription && (
        <div id="community-info">
          <span id="community-header">
            Welcome to the{" "}
            <Topic topic={queries.topic} type="inline community" /> community!
          </span>
          <p id="community-description">{topicDescription}</p>
        </div>
      )}
      <p id="total-articles">
        Showing {1 + (queries.page - 1) * queries.limit}-
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
      {isLoadingArticles && <span className="loader comment-loader"></span>}
      {articleData.articles.length >= articleData.totalCount &&
        !isLoadingArticles && (
          <p className="infinite-scroll-end">That's all of them!</p>
        )}
    </>
  );
}
