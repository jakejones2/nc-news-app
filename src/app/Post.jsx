import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts";
import { getTopics, postArticle, postTopic } from "../api";
import { logoutUser } from "../contexts";

export function Post() {
  const { user } = useContext(UserContext);
  const [errorPostingForm, setErrorPostingForm] = useState("");
  const [postingForm, setPostingForm] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");
  const [postForm, setPostForm] = useState({
    title: "",
    topic: "",
    body: "",
  });
  const [topicDescription, setTopicDescription] = useState("");

  function checkIfFormReady() {
    if (postForm.title && postForm.topic && postForm.body) {
      setFormReady(true);
    } else {
      setFormReady(false);
    }
  }

  function handleTitle(event) {
    setPostForm((form) => {
      const newForm = { ...form };
      newForm.title = event.target.value;
      return newForm;
    });
    checkIfFormReady();
  }

  function handleTopic(event) {
    setPostForm((form) => {
      const newForm = { ...form };
      newForm.topic = event.target.value;
      return newForm;
    });
    checkIfFormReady();
  }

  function handleBody(event) {
    setPostForm((form) => {
      const newForm = { ...form };
      newForm.body = event.target.value;
      return newForm;
    });
    checkIfFormReady();
  }

  function handleUrl(event) {
    setPostForm((form) => {
      const newForm = { ...form };
      newForm.article_img_url = event.target.value;
      if (!newForm.article_img_url) {
        delete newForm.article_img_url;
      }
      return newForm;
    });
    checkIfFormReady();
  }

  function handleTopicDescription(event) {
    setTopicDescription(event.target.value);
  }

  function handlePost(event) {
    event.preventDefault();
    setErrorPostingForm(false);
    setPostingForm(true);
    getTopics()
      .then((topics) => {
        const dbTopic = topics.find((topic) => {
          return topic.slug === postForm.topic;
        });
        if (!dbTopic) {
          return postTopic({
            slug: postForm.topic,
            description: topicDescription || "No Description",
          });
        }
      })
      .then(() => {
        postForm.author = user.username;
        const options = { headers: { Authorization: `Bearer ${user.token}` } };
        return postArticle(postForm, options);
      })
      .then(() => {
        setPostingForm(false);
        setRedirectTo("/"); // add query for username so it comes up top?
      })
      .catch((err) => {
        console.log(err);
        setPostingForm(false);
        if (err.response.status === 403) {
          logoutUser(setUser);
          setRedirectTo("/login");
        } else if (err.response.status === 400) {
          setErrorPostingForm(err.response.data.msg);
        } else {
          setErrorPostingForm(
            "Something is wrong with this form or our servers - sorry!"
          );
        }
      });
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  if (errorPostingForm) {
    return <div className="articles-error">{errorPostingForm}</div>;
  }

  if (postingForm) {
    return <span className="loader"></span>;
  }

  return (
    <form id="post-article-form" onSubmit={handlePost}>
      <label className="form-label" htmlFor="title">
        Article Title
      </label>
      <input
        className="form-input"
        id="title"
        value={postForm.title}
        onChange={handleTitle}
      />
      <label className="form-label" htmlFor="topic">
        Article Topic
      </label>
      <p className="form-help">
        If you are proposing a new topic, add a description below! Otherwise
        this will be ignored.
      </p>
      <input
        className="form-input"
        id="topic"
        value={postForm.topic}
        onChange={handleTopic}
      />
      <label className="form-label" htmlFor="topicDescription">
        Topic Description (optional)
      </label>
      <input
        className="form-input"
        id="topicDescription"
        value={topicDescription}
        onChange={handleTopicDescription}
      />
      <label className="form-label" htmlFor="body">
        Article Body
      </label>
      <textarea
        className="form-text-input"
        id="body"
        value={postForm.body}
        onChange={handleBody}
      />
      <label className="form-label" htmlFor="url">
        Image URL (optional)
      </label>
      <input
        className="form-input"
        id="url"
        value={postForm.article_img_url}
        onChange={handleUrl}
      />
      {formReady && <button className="login-button">Post Article</button>}
    </form>
  );
}
