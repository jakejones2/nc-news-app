import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { getCommentsByUser } from "../api";
import { UserData } from "./Profile/UserData";
import { ArticlePreviews } from "./Feed/ArticlePreviews";
import { Comments } from "./Article/Comments";
import { ItemDropDown } from "./Profile/ItemDropDown";
import { Filters } from "./Reuse/Filters";
import { LikedArticles } from "./Profile/LikedArticles";
import { FilterOptions } from "./Reuse/FilterOptions";

export function Profile() {
  const { username } = useParams();
  const [articles, setArticles] = useState({ totalCount: 0, articles: [] });
  const [commentData, setCommentData] = useState({
    totalCount: 0,
    comments: [],
  });
  const [useInfiniteScrollComments, setUseInfiniteScrollComments] =
    useState(false);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [queries, setQueries] = useState({
    limit: 12,
    page: 1,
    author: username,
    sortBy: "created_at",
    topic: "",
    order: "desc",
  });
  const [commentQueries, setCommentQueries] = useState({
    limit: 10,
    page: 1,
    sortBy: "created_at",
    order: "desc",
  });

  return (
    <>
      <UserData username={username} />
      <ItemDropDown image="../../../book.png" header="Articles">
        <Filters
          queries={queries}
          setQueries={setQueries}
          totalCount={articles.totalCount}
          isLoadingArticles={isLoadingArticles}
          type="user-articles"
        >
          <FilterOptions
            queries={queries}
            setQueries={setQueries}
            type={"user-articles"}
          />
        </Filters>
        <ArticlePreviews
          articles={articles}
          setArticles={setArticles}
          setQueries={setQueries}
          setIsLoadingArticles={setIsLoadingArticles}
          isLoadingArticles={isLoadingArticles}
          queries={queries}
          type="user-articles"
        />
      </ItemDropDown>
      <ItemDropDown image="../../../comments.png" header="Comments">
        <div id="article-comments">
          <Filters
            queries={commentQueries}
            setQueries={setCommentQueries}
            totalCount={commentData.totalCount}
            type="comments"
            useInfiniteScroll={useInfiniteScrollComments}
          >
            <FilterOptions
              queries={commentQueries}
              setQueries={setCommentQueries}
              type={"comments"}
            />
          </Filters>
          <Comments
            getFunction={getCommentsByUser}
            getKey={username}
            getQueries={commentQueries}
            setQueries={setCommentQueries}
            commentData={commentData}
            setCommentData={setCommentData}
            showArticleLinks={true}
            setUseInfiniteScroll={setUseInfiniteScrollComments}
          />
        </div>
      </ItemDropDown>
      <ItemDropDown image="../../../book.png" header="Starred Articles">
        <LikedArticles />
      </ItemDropDown>
    </>
  );
}
