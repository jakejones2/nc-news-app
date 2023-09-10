import { useEffect } from "react";

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
    if (scrollTop + clientHeight >= scrollHeight) {
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
        <span className="loader comment-loader"></span>
      )}
      {data[dataKey].length >= data.totalCount && !isLoading && (
        <p className="infinite-scroll-end">That's all of them!</p>
      )}
    </>
  );
}

export function appendInfiniteScrollData(current, data, dataKey, dataIdKey) {
  const newData = { totalCount: data.totalCount };
  newData[dataKey] = [
    ...current[dataKey],
    ...data[dataKey].filter((newItem) => {
      const match = current[dataKey].find((currentItem) => {
        return currentItem[dataIdKey] === newItem[dataIdKey];
      });
      return !match;
    }),
  ];
  return newData;
}
