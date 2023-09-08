import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Filters } from "./Feed/Filters";
import { ArticlePreviews } from "./Feed/ArticlePreviews";

export function Feed() {
  const url = new URLSearchParams(window.location.search);
  const { topic } = useParams();
  const urlQueries = {
    limit: url.get("limit") || 10,
    page: url.get("page") || 1,
    author: url.get("author") || "",
    sortBy: url.get("sort_by") || "created_at",
    topic: url.get("topic") || topic || "",
    order: url.get("order") || "desc",
  };
  const [articles, setArticles] = useState({ totalCount: 0, articles: [] });
  const [queries, setQueries] = useState(urlQueries);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(queries);
  }, [queries]);

  return (
    <>
      <Filters queries={queries} setQueries={setQueries} articles={articles} />
      <ArticlePreviews
        articles={articles}
        setArticles={setArticles}
        queries={queries}
        setQueries={setQueries}
      />
    </>
  );
}
