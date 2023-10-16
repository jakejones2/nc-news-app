import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Query, TopicInterface, getTopics, validOrders, validSorts } from "../../api";

export function FilterOptions({ queries, setQueries, type }: {
  queries: Query,
  setQueries: Dispatch<SetStateAction<Query>>,
  type: string
}) {
  const [topics, setTopics] = useState<TopicInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleQuery(event: ChangeEvent<HTMLSelectElement>, query: keyof Query) {
    setQueries((oldQueries) => {
      const newQueries = { ...oldQueries };
      // cannot figure out newQueries[query] in Typescript yet
      const value = event.target.value
      switch (query) {
        case "limit":
          newQueries.limit = +value
          break
        case "page":
          newQueries.page = +value
          break
        case "sortBy":
          newQueries.sortBy = value as validSorts
          break
        case "order":
          newQueries.order = value as validOrders
          break
        case "author":
          newQueries.author = value
          break
        case "topic":
          newQueries.topic = value
      }
      if (query !== 'page') newQueries.page = 1;
      return newQueries;
    });
  }

  useEffect(() => {
    if (["articles", "user-articles"].includes(type)) {
      setIsLoading(true);
      getTopics()
        .then((topics) => {
          setTopics(topics);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setTopics([]);
        });
    }
  }, []);

  function capitalise(string: string) {
    const words = string.split(" ");
    const capitalised: string[] = [];
    words.forEach((word) => {
      capitalised.push(word[0].toUpperCase() + word.slice(1));
    });
    return capitalised.join(" ");
  }

  const showTopics = Boolean(topics.length);

  if (isLoading) {
    return <span className="loader loader--topic"></span>;
  }

  return (
    <form className="filter-options">
      {showTopics && (
        <div className="filter-options__option">
          <label className="filter-options__label" htmlFor="topic">
            Topic
          </label>
          <select
            className="select select--filter"
            id="topic"
            value={queries.topic}
            onChange={(event) => handleQuery(event, "topic")}
          >
            {topics.map((topic) => {
              return (
                <option key={topic.slug} value={topic.slug}>
                  {capitalise(topic.slug)}
                </option>
              );
            })}
            <option key="any" value="">
              Any
            </option>
          </select>
        </div>
      )}
      <div className="filter-options__option">
        <label className="filter-options__label" htmlFor="sort-by">
          Sort By
        </label>
        <select
          className="select select--filter"
          id="sort-by"
          value={queries.sortBy}
          onChange={(event) => handleQuery(event, "sortBy")}
        >
          <option key="created_at" value="created_at">
            Date Published
          </option>

          <option key="votes" value="votes">
            Votes
          </option>

          {showTopics && type === "articles" && (
            <option key="author" value="author">
              Author
            </option>
          )}

          {showTopics && (
            <option key="title" value="title">
              Title
            </option>
          )}

          {showTopics && (
            <option key="commentCount" value="comment_count">
              Number Of Comments
            </option>
          )}
        </select>
      </div>
    </form>
  );
}
