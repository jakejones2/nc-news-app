import { useContext, useEffect, useState } from "react";
import { FilterOptions } from "./FilterOptions";
import { getTopics } from "../../api";

export function Filters({ queries, setQueries, totalCount, type }) {
  const totalPages = Math.ceil(totalCount / queries.limit);
  const [isChoosingFilters, setIsChoosingFilters] = useState(false);
  const [topics, setTopics] = useState([]);

  function changePage(num) {
    setQueries((oldQueries) => {
      const newQueries = { ...oldQueries };
      newQueries.page += num;
      return newQueries;
    });
  }

  useEffect(() => {
    if (type === "articles" || type === "user-articles") {
      getTopics().then((topics) => {
        setTopics(topics);
      });
    }
  }, []);

  function setFilters() {
    setIsChoosingFilters((bool) => !bool);
  }

  function changeOrder() {
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
        <div className="pages">
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
        </div>
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
      {isChoosingFilters && (
        <FilterOptions
          topics={topics}
          queries={queries}
          setQueries={setQueries}
          type={type}
        />
      )}
    </>
  );
}
