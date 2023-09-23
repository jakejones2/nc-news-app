import { useState } from "react";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { Filters } from "../Reuse/Filters";
import { FilterOptions } from "../Reuse/FilterOptions";
import { ArticlePreviews } from "../Feed/ArticlePreviews";
import { InfiniteScroll } from "../Reuse/InfiniteScroll";

export function UserArticles({ username }) {
  const [articleData, setArticleData] = useState({
    totalCount: 0,
    articles: [],
  });
  const [queries, setQueries] = useState({
    limit: 12,
    page: 1,
    author: username,
    sortBy: "created_at",
    topic: "",
    order: "desc",
  });
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [scrollType, setScrollType] = useState("");

  return (
    <ItemDropDown image="../../../book.png" header="Articles">
      <Filters
        queries={queries}
        setQueries={setQueries}
        isLoading={isLoadingArticles}
        scrollType={scrollType}
        setScrollType={setScrollType}
        totalCount={articleData.totalCount}
        type="user-articles"
      >
        <FilterOptions
          queries={queries}
          setQueries={setQueries}
          type={"user-articles"}
        />
      </Filters>
      <InfiniteScroll
        data={articleData}
        isLoading={isLoadingArticles}
        getQueries={queries}
        setQueries={setQueries}
        scrollType={scrollType}
        setScrollType={setScrollType}
        dataKey={"articles"}
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
          type="user-articles"
        />
      </InfiniteScroll>
    </ItemDropDown>
  );
}
