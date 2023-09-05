import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTopics } from "../../api";

export function FilterOptions({ queries, setQueries }) {
  const [topics, setTopics] = useState([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  function handleTopic(event) {
    setQueries((queries) => {
      const newQueries = { ...queries };
      newQueries.topic = event.target.value;
      return newQueries;
    });
  }

  function handleSortBy(event) {
    setQueries((queries) => {
      const newQueries = { ...queries };
      newQueries.sortBy = event.target.value;
      return newQueries;
    });
  }

  function capitalise(string) {
    const words = string.split(" ");
    const capitalised = [];
    words.forEach((word) => {
      capitalised.push(word[0].toUpperCase() + word.slice(1));
    });
    return capitalised.join(" ");
  }

  function updateUrl(event) {
    window.history.replaceState(null, `Feed`, `/`);
    setSearchParams(queries);
  }

  useEffect(() => {
    setIsLoadingTopics(true);
    getTopics().then((topics) => {
      setTopics(topics);
      setIsLoadingTopics(false);
    });
  }, []);

  if (isLoadingTopics) return <span className="loader comment-loader"></span>;

  return (
    <form onChange={updateUrl} id="filter-form">
      <div id="topic-filter" className="filter">
        <label className="filter-label" htmlFor="topic">
          Topic
        </label>
        <select
          className="filter-dropdown"
          id="topic"
          value={queries.topic}
          onChange={handleTopic}
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
      <div id="sort-by-filter" className="filter">
        <label className="filter-label" htmlFor="sort-by">
          Sort By
        </label>
        <select
          className="filter-dropdown"
          id="sort-by"
          value={queries.sortBy}
          onChange={handleSortBy}
        >
          <option key="author" value="author">
            Author
          </option>
          <option key="title" value="title">
            Title
          </option>
          <option key="topic" value="topic">
            Topic
          </option>
          <option key="created_at" value="created_at">
            Date Published
          </option>
          <option key="votes" value="votes">
            Votes
          </option>
          <option key="commentCount" value="comment_count">
            Number Of Comments
          </option>
        </select>
      </div>
    </form>
  );
}
