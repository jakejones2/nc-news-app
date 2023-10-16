import { useContext, useEffect, useState } from "react";
import { UserContext, logoutUser } from "../../contexts";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export function Star({
  patchFunction,
  type,
  userVotes,
  id,
  votes,
}: {
  patchFunction: Function;
  type: string;
  userVotes: boolean;
  id: number;
  votes: number;
}) {
  const { user, setUser } = useContext(UserContext);
  const [starred, setStarred] = useState(userVotes);
  const [errorVoting, setErrorVoting] = useState("");
  const [newTotal, setNewTotal] = useState(votes);
  const navigate = useNavigate();

  function handlePatchError(num: number, status?: number) {
    increaseVoteInState(num);
    if (num > 0) {
      setStarred(true);
    } else {
      setStarred(false);
    }
    setErrorVoting("Voting offline - sorry!");
    if (!status) return;
    if ([401, 403].includes(status)) {
      logoutUser(setUser);
      navigate("/login");
    }
  }

  function handleVote() {
    if (user.username === "guest") {
      setErrorVoting("Log in to vote!");
    } else {
      setErrorVoting("");
      const options = { headers: { Authorization: `Bearer ${user.token}` } };
      if (starred) {
        setStarred(false);
        increaseVoteInState(-1);
        patchFunction(id, 0, options).catch((err: AxiosError) => {
          console.log(err);
          handlePatchError(1, err.response?.status);
        });
      } else {
        setStarred(true);
        increaseVoteInState(1);
        patchFunction(id, 1, options).catch((err: AxiosError) => {
          console.log(err);
          handlePatchError(0, err.response?.status);
        });
      }
    }
  }

  function increaseVoteInState(num: number) {
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
