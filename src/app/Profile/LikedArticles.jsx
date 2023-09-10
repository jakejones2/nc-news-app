import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { getArticle, getUserArticleVotes } from "../../api";
import { ArticlePreview } from "../Feed/ArticlePreview";

export function LikedArticles() {
  const { setUser, user } = useContext(UserContext);
  const [errorLoadingArticles, setErrorLoadingArticles] = useState("");
  const [articleVotes, setArticleVotes] = useState([]);
  const [renderStart, setRenderStart] = useState(0);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setIsLoadingArticles(true);
    getUserArticleVotes(user.username)
      .then((articleVotes) => {
        const votes = [];
        articleVotes.forEach((vote) => {
          votes.push({ article_id: vote.article_id, votes: vote.votes });
        });
        setArticleVotes(() => votes);
        const promises = [];
        for (const vote of votes.slice(renderStart, renderStart + 6)) {
          promises.push(getArticle(vote.article_id));
        }
        return Promise.all(promises);
      })
      .then((newArticles) => {
        setArticles((currentArticles) => {
          return [
            ...currentArticles,
            ...newArticles.filter((newArticle) => {
              return !currentArticles.find((currentArticle) => {
                return currentArticle.article_id === newArticle.article_id;
              });
            }),
          ];
        });
        setIsLoadingArticles(false);
      });
  }, [renderStart]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articles]);

  function handleScroll() {
    if (articles.length === articleVotes.length) return;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setRenderStart((start) => start + 6);
    }
  }

  return (
    <div>
      <ul className="cards liked-articles">
        {articles.map((article) => {
          return (
            <li className="article-preview" key={article.article_id}>
              <ArticlePreview
                userVotes={true}
                article={article}
                articles={articles}
                setArticles={setArticles}
              ></ArticlePreview>
            </li>
          );
        })}
      </ul>
      {isLoadingArticles && <span className="loader"></span>}
      {articles.length === articleVotes.length && !isLoadingArticles && (
        <p className="infinite-scroll-end">That's all of them!</p>
      )}
    </div>
  );
}
