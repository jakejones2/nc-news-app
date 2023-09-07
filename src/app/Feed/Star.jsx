import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";

export function Star({ patchFunction, type, userVotes, id, votes }) {
  const { user } = useContext(UserContext);
  const [starred, setStarred] = useState(userVotes);
  const [errorVoting, setErrorVoting] = useState(false);
  const [newTotal, setNewTotal] = useState(votes);

  function handlePatchError(err, num) {
    console.log(err);
    increaseVoteInState(num);
    if (num > 0) {
      setStarred(true);
    } else {
      setStarred(false);
    }
    if ([401, 403].includes(err.response.status)) {
      // tryAgainWithRefresh(patchFunction, setUser, id, -num)
      logoutUser(setUser);
      setRedirect(true);
    } else {
      setErrorVoting(true);
    }
  }

  function handleVote() {
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

  function increaseVoteInState(num) {
    setNewTotal((total) => {
      return total + num;
    });
  }

  if (errorVoting) {
    return <p className={`${type}-vote-error`}>Voting offline - sorry!</p>;
  }

  return (
    <div className={`${type}-stat`}>
      <img
        onClick={handleVote}
        className={`${type}-logo ` + (starred ? "star" : "")}
        src="../../../star-gold.png"
      ></img>
      <p className={`${type}-stat-text`}>{newTotal}</p>{" "}
    </div>
  );
}
