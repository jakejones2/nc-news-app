import { useContext, useEffect, useState } from "react";
import { getArticles } from "../../api";
import { ArticlePreview } from "./ArticlePreview";

export function ArticlePreviews({ articles, setArticles, queries }) {
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [errorLoadingArticles, setErrorLoadingArticles] = useState(false);

  useEffect(() => {
    setIsLoadingArticles(true);
    setErrorLoadingArticles(false);
    getArticles(queries)
      .then((articles) => {
        setArticles(articles);
        setIsLoadingArticles(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorLoadingArticles(true);
        setIsLoadingArticles(false);
      });
  }, [queries]);

  if (errorLoadingArticles) {
    return (
      <div className="articles-error">
        Can't fetch articles right now - sorry!
      </div>
    );
  }

  if (isLoadingArticles) {
    return <span className="loader"></span>;
  }

  return (
    <>
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
              <ArticlePreview article={article}></ArticlePreview>
            </li>
          );
        })}
      </ul>
    </>
  );
}
