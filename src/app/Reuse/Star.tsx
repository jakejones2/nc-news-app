import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { useNavigate } from "react-router-dom";

export function Star({ patchFunction, type, userVotes, id, votes }) {
  const { user, setUser } = useContext(UserContext);
  const [starred, setStarred] = useState(userVotes);
  const [errorVoting, setErrorVoting] = useState("");
  const [newTotal, setNewTotal] = useState(votes);
  const navigate = useNavigate();

  function handlePatchError(err, num) {
    console.log(err);
    increaseVoteInState(num);
    if (num > 0) {
      setStarred(true);
    } else {
      setStarred(false);
    }
    if ([401, 403].includes(err.response.status)) {
      logoutUser(setUser);
      navigate("/login");
    } else {
      setErrorVoting("Voting offline - sorry!");
    }
  }

  function handleVote() {
    if (user.username === "guest") {
      setErrorVoting("Log in to vote!");
    } else {
      setErrorVoting(false);
      const options = { headers: { Authorization: `Bearer ${user.token}` } };
      if (starred) {
        setStarred(false);
        increaseVoteInState(-1);
        patchFunction(id, 0, options).catch((err) => {
          handlePatchError(err, 1);
        });
      } else {
        setStarred(true);
        increaseVoteInState(1);
        patchFunction(id, 1, options).catch((err) => {
          handlePatchError(err, 0);
        });
      }
    }
  }

  function increaseVoteInState(num) {
    setNewTotal((total) => {
      return total + num;
    });
  }

  if (errorVoting) {
    return <p className={`${type}__vote-error`}>{errorVoting}</p>;
  }

  return (
    <div className={`${type}__stat`}>
      <img
        onClick={handleVote}
        className={`${type}__logo star ` + (starred ? "star--shine" : "")}
        src="../../../star.png"
      ></img>
      <p className={`${type}__stat-text`}>{newTotal}</p>
    </div>
  );
}
