import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filters } from "./Reuse/Filters";
import { ArticlePreviews } from "./Feed/ArticlePreviews";
import { FilterOptions } from "./Reuse/FilterOptions";
import { InfiniteScroll } from "./Reuse/InfiniteScroll";

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
  const [scrollType, setScrollType] = useState(
    queries.page > 1 ? "paginated" : ""
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
        isLoading={isLoadingArticles}
        scrollType={scrollType}
        setScrollType={setScrollType}
        type="articles"
      >
        <FilterOptions
          queries={queries}
          setQueries={setQueries}
          type="articles"
        />
      </Filters>
      <InfiniteScroll
        isLoading={isLoadingArticles}
        data={articleData}
        dataKey={"articles"}
        getQueries={queries}
        setQueries={setQueries}
        scrollType={scrollType}
        setScrollType={setScrollType}
      >
        <ArticlePreviews
          articleData={articleData}
          setArticleData={setArticleData}
          setIsLoadingArticles={setIsLoadingArticles}
          isLoadingArticles={isLoadingArticles}
          queries={queries}
          setQueries={setQueries}
          scrollType={scrollType}
          setScrollType={setScrollType}
        />
      </InfiniteScroll>
    </>
  );
}
