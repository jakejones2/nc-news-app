import { useContext, useEffect, useState } from "react";
import { FilterOptions } from "./FilterOptions";
import { getTopics } from "../../api";

export function Filters({ queries, setQueries, articles }) {
  const totalPages = Math.ceil(articles.totalCount / queries.limit);
  const [isChoosingFilters, setIsChoosingFilters] = useState(false);
  const [topics, setTopics] = useState([]);

  function changePage(num) {
    setQueries((queries) => {
      const newQueries = { ...queries };
      newQueries.page += num;
      return newQueries;
    });
  }

  useEffect(() => {
    getTopics().then((topics) => {
      setTopics(topics);
    });
  }, []);

  function setFilters() {
    setIsChoosingFilters((bool) => !bool);
  }

  return (
    <>
      <nav id="filters">
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
        <button className="page-nav" onClick={setFilters}>
          filters
          <span
            className={
              isChoosingFilters ? "drop-down-filter" : "drop-up-filter"
            }
          ></span>
        </button>
      </nav>
      {isChoosingFilters && (
        <FilterOptions
          topics={topics}
          queries={queries}
          setQueries={setQueries}
        />
      )}
    </>
  );
}
