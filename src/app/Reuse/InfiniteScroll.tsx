import { useEffect } from "react";
import { CommentInterface } from "../Article/Comment";
import { ArticleInterface } from "../Article";

export function InfiniteScroll({
  isLoading,
  data,
  dataKey,
  getQueries,
  setQueries,
  scrollType,
  setScrollType,
  children,
}) {
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchmove", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [getQueries, data, isLoading]);

  function handleScroll() {
    if (isLoading || scrollType === "paginated") return;
    if (data[dataKey].length === data.totalCount) return;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight + 100 >= scrollHeight) {
      setScrollType("infinite");
      setQueries((current) => {
        const newQueries = { ...current };
        newQueries.page =
          Math.floor(data[dataKey].length / getQueries.limit) + 1;
        return newQueries;
      });
    }
  }
  return (
    <>
      {children}
      {isLoading && scrollType === "infinite" && (
        <span className="loader loader--comment"></span>
      )}
      {data[dataKey].length >= data.totalCount &&
      !isLoading &&
      data[dataKey].length ? (
        <p className="scroll-end">That's all of them!</p>
      ) : (
        ""
      )}
    </>
  );
}

// cannot type this function... 
export function appendInfiniteScrollData<Type extends CommentInterface | ArticleInterface>(current: Type[], incoming: Type[]): Type[] {
  if (!current.length) return incoming
  const key = Object.keys(current[0]).find((key) => key.endsWith('_id'))
  if (!key) return incoming
  const newItems = incoming.filter((newItem) => {
    const match = current.find((currentItem) => {
      return currentItem[key as keyof Type] === newItem[key as keyof Type]
    });
    return !match;
  })
  return current.concat(newItems)
}
