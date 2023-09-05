import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Filters } from "./Feed/Filters";
import { ArticlePreviews } from "./Feed/ArticlePreviews";

export function Feed() {
  const { topic } = useParams();
  const [articles, setArticles] = useState({ totalCount: 0, articles: [] });
  const [queries, setQueries] = useState({
    limit: 10,
    page: 1,
    author: "",
    sortBy: "created_at",
    topic: topic,
    order: "desc",
  });

  return (
    <>
      <Filters queries={queries} setQueries={setQueries} articles={articles} />
      <ArticlePreviews
        articles={articles}
        setArticles={setArticles}
        queries={queries}
      />
    </>
  );
}
