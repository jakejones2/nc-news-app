import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";
import { Query, getArticles, getTopic, getUserArticleVotes } from "../../api";
import { ArticlePreview } from "./ArticlePreview";
import { Topic } from "../Article/Topic";
import { appendInfiniteScrollData } from "../Reuse/InfiniteScroll";
import { Article } from "../Article";
import { ArticlesState } from "../Feed";
import { ScrollOptions } from "../Reuse/Filters";

export interface Articles {
  totalCount: number,
  articles: Article[]
}

export interface UserArticleVotes {
  [article_id: number]: number
}

export function ArticlePreviews({
  articleData,
  setArticleData,
  setIsLoadingArticles,
  isLoadingArticles,
  queries,
  setQueries,
  scrollType,
  setScrollType,
}: {
  articleData: ArticlesState,
  setArticleData: Dispatch<SetStateAction<ArticlesState>>,
  setIsLoadingArticles: Dispatch<SetStateAction<boolean>>,
  isLoadingArticles: boolean,
  queries: Query,
  setQueries: Dispatch<SetStateAction<Query>>,
  scrollType: ScrollOptions,
  setScrollType: Dispatch<SetStateAction<ScrollOptions>>
}) {
  const { user } = useContext(UserContext);
  const [errorLoadingArticles, setErrorLoadingArticles] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [articleVotes, setArticleVotes] = useState<UserArticleVotes>({});

  useEffect(() => {
    setIsLoadingArticles(true);
    setErrorLoadingArticles("");
    setTopicDescription("");
    if (queries.topic) {
      getTopic(queries.topic).then((description) => {
        setTopicDescription(description);
      });
    }
    getArticles(queries)
      .then((articleData) => {
        if (scrollType === "infinite") {
          setArticleData((current) => {
            return {
              totalCount: articleData.totalCount,
              articles: appendInfiniteScrollData<Article>(
                current.articles,
                articleData.articles,
              )
          }});
        } else setArticleData(articleData);
        return getUserArticleVotes(user.username);
      })
      .then((articleVotes) => {
        const votes: UserArticleVotes = {};
        articleVotes.forEach((vote) => {
          votes[vote.article_id] = vote.votes;
        });
        setArticleVotes(votes);
        setIsLoadingArticles(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          setErrorLoadingArticles("This article doesn't exist yet...");
        } else {
          setErrorLoadingArticles("Can't fetch articles right now - sorry!");
        }
      });
  }, [queries]);

  useEffect(() => {
    setArticleData(() => {
      return { totalCount: 0, articles: [] };
    });
    if (scrollType === "infinite") setScrollType("");
  }, [queries.order, queries.sortBy, queries.topic]);

  if (errorLoadingArticles) {
    return <div className="error">{errorLoadingArticles}</div>;
  }

  if (isLoadingArticles && scrollType !== "infinite") {
    return <span className="loader"></span>;
  }

  const page = queries.page || 1
  const limit = queries.limit || 12

  return (
    <>
      {topicDescription && (
        <div className="community">
          <span className="community__header">
            Welcome to the <Topic topic={queries.topic || "all"} type="inline"/>{" "}
            community!
          </span>
          <p className="community__description">{topicDescription}</p>
        </div>
      )}
      <p className="total-articles">
        Showing{" "}
        {scrollType === "infinite" ? 1 : 1 + (page - 1) * limit}
        -
        {articleData.totalCount < page * limit
          ? articleData.totalCount
          : page * limit}{" "}
        of {articleData.totalCount}
      </p>
      <ul className="cards">
        {articleData.articles.map((article) => {
          return (
            <li className="article-preview" key={article.article_id}>
              <ArticlePreview
                userVotes={articleVotes[article.article_id as keyof UserArticleVotes]}
                article={article}
                setArticleData={setArticleData}
                setQueries={setQueries}
              ></ArticlePreview>
            </li>
          );
        })}
      </ul>
    </>
  );
}
