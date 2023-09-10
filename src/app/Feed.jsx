import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filters } from "./Reuse/Filters";
import { ArticlePreviews } from "./Feed/ArticlePreviews";
import { FilterOptions } from "./Reuse/FilterOptions";

export function Feed() {
  const url = new URLSearchParams(window.location.search);
  const urlQueries = {
    limit: url.get("limit") || 12,
    page: url.get("page") || 1,
    author: url.get("author") || "",
    sortBy: url.get("sort_by") || "created_at",
    topic: url.get("topic") || "",
    order: url.get("order") || "desc",
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [articleData, setArticleData] = useState({
    totalCount: 0,
    articles: [],
  });
  const [queries, setQueries] = useState(urlQueries);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [useManualScroll, setUseManualScroll] = useState(
    queries.page > 1 ? true : false
  );

  useEffect(() => {
    setSearchParams(queries);
  }, [queries]);

  return (
    <>
      <Filters
        queries={queries}
        setQueries={setQueries}
        totalCount={articleData.totalCount}
        type="articles"
        isLoadingArticles={isLoadingArticles}
        useInfiniteScroll={useInfiniteScroll}
        setUseManualScroll={setUseManualScroll}
      >
        <FilterOptions
          queries={queries}
          setQueries={setQueries}
          type="articles"
        />
      </Filters>
      <ArticlePreviews
        articleData={articleData}
        setArticleData={setArticleData}
        setIsLoadingArticles={setIsLoadingArticles}
        isLoadingArticles={isLoadingArticles}
        queries={queries}
        setQueries={setQueries}
        useInfiniteScroll={useInfiniteScroll}
        setUseInfiniteScroll={setUseInfiniteScroll}
        useManualScroll={useManualScroll}
      />
    </>
  );
}
