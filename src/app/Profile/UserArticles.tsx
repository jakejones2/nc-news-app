import { useEffect, useState } from "react";
import { ItemDropDown } from "../Reuse/ItemDropDown";
import { Filters, ScrollOptions } from "../Reuse/Filters";
import { FilterOptions } from "../Reuse/FilterOptions";
import { ArticlePreviews } from "../Feed/ArticlePreviews";
import { InfiniteScroll } from "../Reuse/InfiniteScroll";
import { ArticlesState } from "../Feed";
import { Query } from "../../api";

export function UserArticles({ username }: {username: string}) {
  const [articleData, setArticleData] = useState<ArticlesState>({
    totalCount: 0,
    articles: [],
  });
  const [queries, setQueries] = useState<Query>({
    limit: 12,
    page: 1,
    author: username,
    sortBy: "created_at",
    topic: "",
    order: "desc",
  });
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [scrollType, setScrollType] = useState<ScrollOptions>("");

  useEffect(() => {
    setQueries({
      limit: 12,
      page: 1,
      author: username,
      sortBy: "created_at",
      topic: "",
      order: "desc",
    })
  }, [username])

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
        data={articleData.articles}
        totalCount={articleData.totalCount}
        isLoading={isLoadingArticles}
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
    </ItemDropDown>
  );
}
