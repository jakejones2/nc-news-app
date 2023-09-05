import { useContext, useEffect, useState } from "react";
import { getArticles } from "../api";
import { ArticlePreview } from "./Feed/ArticlePreview";

export function Feed() {
  const [articles, setArticles] = useState({ totalCount: 0, articles: [] });
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [errorLoadingArticles, setErrorLoadingArticles] = useState(false);

  useEffect(() => {
    setIsLoadingArticles(true);
    setErrorLoadingArticles(false);
    getArticles()
      .then((articles) => {
        setArticles(articles);
        setIsLoadingArticles(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorLoadingArticles(true);
        setIsLoadingArticles(false);
      });
  }, []);

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
    <ul className="cards">
      {articles.articles.map((article) => {
        return (
          <li className="article-preview" key={article.article_id}>
            <ArticlePreview article={article}></ArticlePreview>
          </li>
        );
      })}
    </ul>
  );
}
