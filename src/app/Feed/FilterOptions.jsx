import { useContext, useEffect, useState } from "react";
import { getTopics } from "../../api";

export function FilterOptions({ queries, setQueries }) {
  const [topics, setTopics] = useState([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  function handleTopic(event) {
    setQueries((queries) => {
      window.history.replaceState(
        null,
        `${event.target.value} Feed`,
        `/${event.target.value}`
      );
      const newQueries = { ...queries };
      newQueries.topic = event.target.value;
      return newQueries;
    });
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
    <form id="filter-form">
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
              {topic.slug}
            </option>
          );
        })}
      </select>
    </form>
  );
}
