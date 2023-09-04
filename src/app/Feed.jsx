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
  });

  return (
    <div id="articles-preview">
      <ul className="cards" id="articles-list">
        {articles.articles.map((article) => {
          return (
            <li key={article.article_id}>
              <ArticlePreview article={article}></ArticlePreview>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
