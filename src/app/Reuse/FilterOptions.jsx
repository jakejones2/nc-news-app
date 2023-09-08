export function FilterOptions({ topics, queries, setQueries, type }) {
  function handleQuery(event, query) {
    setQueries((oldQueries) => {
      const newQueries = { ...oldQueries };
      newQueries[query] = event.target.value;
      console.log(newQueries);
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

  const showTopics = Boolean(topics.length);

  return (
    <form id="filter-form">
      {showTopics && (
        <div id="topic-filter" className="filter">
          <label className="filter-label" htmlFor="topic">
            Topic
          </label>
          <select
            className="filter-dropdown"
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
      <div id="sort-by-filter" className="filter">
        <label className="filter-label" htmlFor="sort-by">
          Sort By
        </label>
        <select
          className="filter-dropdown"
          id="sort-by"
          value={queries.sortBy}
          onChange={(event) => handleQuery(event, "sortBy")}
        >
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
            <option key="created_at" value="created_at">
              Date Published
            </option>
          )}
          {showTopics && (
            <option key="commentCount" value="comment_count">
              Number Of Comments
            </option>
          )}

          <option key="votes" value="votes">
            Votes
          </option>
        </select>
      </div>
    </form>
  );
}
