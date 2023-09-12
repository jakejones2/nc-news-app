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

  function handleInput(event, input) {
    setPostForm((form) => {
      const newForm = { ...form };
      newForm[input] = event.target.value;
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
        postForm.topic = postForm.topic.toLowerCase();
        const dbTopic = topics.find((topic) => {
          return topic.slug === postForm.topic;
        });
        if (!dbTopic) {
          return postTopic({
            slug: postForm.topic,
            description:
              topicDescription || "This topic needs no introduction!",
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
        setRedirectTo("/articles");
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
    return <div className="error">{errorPostingForm}</div>;
  }

  if (postingForm) {
    return <span className="loader"></span>;
  }

  return (
    <>
      <h2 className="post-title">Post a new article!</h2>
      <form className="form" onSubmit={handlePost}>
        <label className="form__label" htmlFor="title">
          Article Title
        </label>
        <input
          className="form__input"
          id="title"
          value={postForm.title}
          onChange={(event) => handleInput(event, "title")}
        />
        <label className="form__label" htmlFor="topic">
          Article Topic
        </label>
        <input
          className="form__input"
          id="topic"
          value={postForm.topic}
          onChange={(event) => handleInput(event, "topic")}
        />
        <label className="form__label" htmlFor="topicDescription">
          Topic Description (optional)
        </label>
        <p className="form__help form__help--new-topic">
          If you are proposing a new topic, add a description here. Otherwise,
          this box will be ignored.
        </p>
        <input
          className="form__input"
          id="topicDescription"
          value={topicDescription}
          onChange={handleTopicDescription}
        />
        <label className="form__label" htmlFor="body">
          Article Body
        </label>
        <textarea
          className="form__text-input"
          id="body"
          value={postForm.body}
          onChange={(event) => handleInput(event, "body")}
        />
        <label className="form__label" htmlFor="url">
          Image URL (optional)
        </label>
        <input
          className="form__input"
          id="url"
          value={postForm.article_img_url}
          onChange={handleUrl}
        />
        {formReady && <button className="form__button">Post Article</button>}
      </form>
    </>
  );
}
