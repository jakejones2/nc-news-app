import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Query } from "../../api";

export type ScrollOptions = "" | "infinite" | "paginated";

export function Filters({
  queries,
  setQueries,
  totalCount,
  type,
  isLoading,
  scrollType,
  setScrollType,
  children,
}: {
  queries: Query;
  setQueries: Dispatch<SetStateAction<Query>>;
  totalCount: number;
  type: string;
  isLoading: boolean;
  scrollType: ScrollOptions;
  setScrollType: Dispatch<SetStateAction<ScrollOptions>>;
  children: ReactNode;
}) {
  const page = queries.page || 1;
  const totalPages = Math.ceil(totalCount / (queries.limit || 12));
  const [isChoosingFilters, setIsChoosingFilters] = useState(false);
  const [showPagination, setShowPagination] = useState(true);
  const [latestQuery, setLatestQuery] = useState(queries);

  function changePage(num: number) {
    setScrollType("paginated");
    setQueries((oldQueries) => {
      const newQueries = { ...oldQueries };
      newQueries.page = +(newQueries.page || 1) + num;
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
                Page {page} of {totalPages}
              </p>
              {showPagination && page > 1 && (
                <button
                  className="filter__button btn btn--page"
                  onClick={() => changePage(-1)}
                >
                  previous
                </button>
              )}
              {showPagination && page < totalPages && (
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
                isChoosingFilters
                  ? "dropdown dropdown--down-small"
                  : "dropdown dropdown--up-small"
              }
            ></span>
          </button>
        </div>
      </nav>
      {isChoosingFilters && children}
    </>
  );
}
