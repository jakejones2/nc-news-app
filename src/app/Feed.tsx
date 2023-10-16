import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filters, ScrollOptions } from "./Reuse/Filters";
import { ArticlePreviews } from "./Feed/ArticlePreviews";
import { FilterOptions } from "./Reuse/FilterOptions";
import { InfiniteScroll } from "./Reuse/InfiniteScroll";
import { Query, validOrders, validSorts } from "../api";
import { Article } from "./Article";

export interface ArticlesState {
  totalCount: number,
  articles: Article[]
}

export interface UrlParams {
  [key: string]: string
}

export function Feed() {
  const url = new URLSearchParams(window.location.search);
  const urlQueries: Query = {
    limit: +(url.get("limit") || 12),
    page: +(url.get("page") || 1),
    author: url.get("author") || "",
    sortBy: url.get("sort_by") as validSorts || "created_at",
    topic: url.get("topic") || "all",
    order: url.get("order") as validOrders || "desc",
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [articleData, setArticleData] = useState<ArticlesState>({
    totalCount: 0,
    articles: [],
  });
  const [queries, setQueries] = useState<Query>(urlQueries);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [scrollType, setScrollType] = useState<ScrollOptions>(
    +(queries.page || 1) > 1 ? "paginated" : ""
  );

  useEffect(() => {
    const params: UrlParams = {}
    for (const param in queries) {
      const value = queries[param as keyof Query]
      if (value) params[param] = value.toString()
    }
    setSearchParams(params);
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
