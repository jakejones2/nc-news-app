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
      <nav className={`filter filter--${type}`}>
        <div className="filter__page">
          {scrollType === "infinite" || type === "user-comments" ? (
            <p className="filter__page-num">Infinite scroll</p>
          ) : (
            <>
              <p className="filter__page-num">
                Page {queries.page} of {totalPages}
              </p>
              {showPagination && queries.page > 1 && (
                <button
                  className="filter__button btn btn--page"
                  onClick={() => changePage(-1)}
                >
                  previous
                </button>
              )}
              {showPagination && queries.page < totalPages && (
                <button className="btn btn--page" onClick={() => changePage(1)}>
                  next
                </button>
              )}
            </>
          )}
        </div>
        <div className="filter__menu">
          {queries.order && (
            <button className="btn btn--page" onClick={changeOrder}>
              {queries.order}
            </button>
          )}
          <button className="btn btn--page" onClick={setFilters}>
            filters
            <span
              className={
                "dropdown " + isChoosingFilters
                  ? "dropdown--down-small"
                  : "dropdown--up-small"
              }
            ></span>
          </button>
        </div>
      </nav>
      {isChoosingFilters && children}
    </>
  );
}
