import { useContext, useEffect, useState } from "react";
import { FilterOptions } from "./FilterOptions";

export function Filters({ queries, setQueries, articles }) {
  const totalPages = Math.ceil(articles.totalCount / queries.limit);
  const [isChoosingFilters, setIsChoosingFilters] = useState(false);

  function changePage(num) {
    setQueries((queries) => {
      const newQueries = { ...queries };
      newQueries.page += num;
      return newQueries;
    });
  }

  function setFilters() {
    setIsChoosingFilters((bool) => !bool);
    // have this state determine the popup of a modal
    // the modal then changes other filter settings, but only once closed!
    // need to render modal depending on query state so it remembers filters.
  }
  return (
    <>
      <nav id="filters">
        <p id="page-num">
          Page {queries.page} of {totalPages}
        </p>
        {queries.page > 1 && (
          <button className="page-nav" onClick={() => changePage(-1)}>
            previous
          </button>
        )}
        {queries.page < totalPages && (
          <button className="page-nav" onClick={() => changePage(1)}>
            next
          </button>
        )}
        <button className="page-nav" onClick={setFilters}>
          filters{" "}
          <span
            className={
              isChoosingFilters ? "drop-down-filter" : "drop-up-filter"
            }
          ></span>
        </button>
      </nav>
      {isChoosingFilters && (
        <FilterOptions queries={queries} setQueries={setQueries} />
      )}
    </>
  );
}
