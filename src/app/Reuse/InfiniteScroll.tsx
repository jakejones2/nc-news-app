import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { CommentInterface } from "../Article/Comment";
import { ArticleInterface } from "../Article";
import { ScrollOptions } from "./Filters";
import { Query } from "../../api";

export function InfiniteScroll({
  isLoading,
  data,
  totalCount,
  getQueries,
  setQueries,
  scrollType,
  setScrollType,
  children,
}: {
  isLoading: boolean;
  data: ArticleInterface[] | CommentInterface[];
  totalCount: number;
  getQueries: Query;
  setQueries: Dispatch<SetStateAction<Query>>;
  scrollType: ScrollOptions;
  setScrollType: Dispatch<SetStateAction<ScrollOptions>>;
  children: ReactNode;
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
    if (data.length === totalCount) return;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight + 100 >= scrollHeight) {
      setScrollType("infinite");
      setQueries((current) => {
        const newQueries = { ...current };
        newQueries.page =
          Math.floor(data.length / (getQueries.limit || 12)) + 1;
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
      {data.length >= totalCount && !isLoading && data.length ? (
        <p className="scroll-end">That's all of them!</p>
      ) : (
        ""
      )}
    </>
  );
}

export function appendInfiniteScrollData<
  Type extends CommentInterface | ArticleInterface,
>(current: Type[], incoming: Type[]): Type[] {
  if (!current.length) return incoming;
  const key = Object.keys(current[0]).find((key) => key.endsWith("_id"));
  if (!key) return incoming;
  const newItems = incoming.filter((newItem) => {
    const match = current.find((currentItem) => {
      return currentItem[key as keyof Type] === newItem[key as keyof Type];
    });
    return !match;
  });
  return current.concat(newItems);
}
