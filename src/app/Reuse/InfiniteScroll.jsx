export function InfiniteScroll({
  isLoading,
  useManualScroll,
  data,
  dataKey,
  dataIdKey,
  voteData,
  getQueries,
  document,
  setUseInfiniteScroll,
  setQueries,
  children,
}) {
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [getQueries, data, voteData]);

  function handleScroll() {
    if (isLoading || useManualScroll) return;
    if (data[dataKey].length === data.totalCount) return;
    const { limit, page } = getQueries;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setUseInfiniteScroll(true);
      setQueries((current) => {
        const newQueries = { ...current };
        newQueries.page = Math.floor(data[dataKey].length / limit) + 1;
        return newQueries;
      });
    }
  }

  function appendData() {
    setData((current) => {
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
    });
  }
}
