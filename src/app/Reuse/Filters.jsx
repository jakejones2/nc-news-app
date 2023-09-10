import { useContext, useEffect, useState } from "react";
import { FilterOptions } from "./FilterOptions";
import { getTopics } from "../../api";

export function Filters({
  queries,
  setQueries,
  totalCount,
  type,
  isLoading,
  scrollType,
  setScrollType,
  children,
}) {
  const totalPages = Math.ceil(totalCount / queries.limit);
  const [isChoosingFilters, setIsChoosingFilters] = useState(false);
  const [showPagination, setShowPagination] = useState(true);
  const [latestQuery, setLatestQuery] = useState(queries);

  function changePage(num) {
    setScrollType("paginated");
    setQueries((oldQueries) => {
      const newQueries = { ...oldQueries };
      newQueries.page = +newQueries.page + num;
      if (newQueries.page === 1) {
        setScrollType("");
      }
      return newQueries;
    });
  }

  useEffect(() => {
    if (isLoading && latestQuery.topic !== queries.topic) {
      setShowPagination(false);
    } else {
      setShowPagination(true);
    }
    setLatestQuery(queries);
  }, [isLoading]);

  function setFilters() {
    setIsChoosingFilters((bool) => !bool);
  }

  function changeOrder() {
    setScrollType("paginated");
    setQueries((oldQueries) => {
      const newQueries = { ...oldQueries };
      if (newQueries.order === "asc") {
        newQueries.order = "desc";
        return newQueries;
      } else {
        newQueries.order = "asc";
        return newQueries;
      }
    });
  }

  return (
    <>
      <nav className={`filters ${type}-filters`}>
        {scrollType === "infinite" || type === "user-comments" ? (
          <div className="pages">
            <p id="page-num">Infinite scroll</p>
          </div>
        ) : (
          <div className="pages">
            <p id="page-num">
              Page {queries.page} of {totalPages}
            </p>
            {showPagination && queries.page > 1 && (
              <button className="page-nav" onClick={() => changePage(-1)}>
                previous
              </button>
            )}
            {showPagination && queries.page < totalPages && (
              <button className="page-nav" onClick={() => changePage(1)}>
                next
              </button>
            )}
          </div>
        )}
        <div className="order">
          {queries.order && (
            <button className="page-nav" onClick={changeOrder}>
              {queries.order}
            </button>
          )}
          <button className="page-nav" onClick={setFilters}>
            filters
            <span
              className={
                isChoosingFilters ? "drop-down-filter" : "drop-up-filter"
              }
            ></span>
          </button>
        </div>
      </nav>
      {isChoosingFilters && children}
    </>
  );
}
