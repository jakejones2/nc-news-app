import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { getArticles, getTopic, getUserArticleVotes } from "../../api";
import { ArticlePreview } from "./ArticlePreview";
import { Filters } from "./Filters";

export function ArticlePreviews({
  articles,
  setArticles,
  queries,
  setQueries,
  type,
}) {
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const { setUser, user } = useContext(UserContext);
  const [errorLoadingArticles, setErrorLoadingArticles] = useState("");
  const [articleVotes, setArticleVotes] = useState({});
  const [topicDescription, setTopicDescription] = useState("");

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
      .then((articles) => {
        setArticles(articles);
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

  if (errorLoadingArticles) {
    return <div className="articles-error">{errorLoadingArticles}</div>;
  }

  if (isLoadingArticles) {
    return <span className="loader"></span>;
  }

  return (
    <>
      {topicDescription && (
        <div id="community-info">
          <span id="community-header">
            Welcome to the <span id="community">{queries.topic}</span>{" "}
            community!
          </span>
          <p id="community-description">{topicDescription}</p>
        </div>
      )}
      <p id="total-articles">
        Showing {1 + (queries.page - 1) * queries.limit}-
        {articles.totalCount < queries.page * queries.limit
          ? articles.totalCount
          : queries.page * queries.limit}{" "}
        of {articles.totalCount}
      </p>
      <ul className="cards">
        {articles.articles.map((article) => {
          return (
            <li className="article-preview" key={article.article_id}>
              <ArticlePreview
                userVotes={articleVotes[article.article_id]}
                article={article}
                articles={articles}
                setArticles={setArticles}
                setQueries={setQueries}
              ></ArticlePreview>
            </li>
          );
        })}
      </ul>
      {!articles.articles.length && (
        <p className="articles-error no-articles">Nothing to see here :(</p>
      )}
      {articles.articles.length >= queries.limit && (
        <Filters
          queries={queries}
          setQueries={setQueries}
          totalCount={articles.totalCount}
          type={type}
        />
      )}
    </>
  );
}
