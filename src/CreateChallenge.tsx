import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import { dictionarySet, getChallengeUrl } from "./util";

const CreateChallenge = () => {
  const [hint, setHint] = useState("Enter a word (4-11 letters)");
  const [enteredWord, setEnteredWord] = useState("");
  const [author, setAuthor] = useState("");
  const [enteredWordIsValid, setEnteredWordIsValid] = useState(false);

  useEffect(() => {
    const checkEnteredWordValidity = (): void => {
      if (enteredWord.length < 4) {
        setHint("Enter a word (4-11 letters)");
        setEnteredWordIsValid(false);
      } else if (enteredWord.length > 11) {
        setHint("Maximum length is 11 letters!");
        setEnteredWordIsValid(false);
      } else if (!dictionarySet.has(enteredWord)) {
        setHint("Enter a real word");
        setEnteredWordIsValid(false);
      } else {
        setHint("Great!");
        setEnteredWordIsValid(true);
      }
    };
    checkEnteredWordValidity();
  }, [enteredWord, enteredWordIsValid]);

  const wordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredWord(event.target.value);
  };

  const authorChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const keydownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Backspace") {
      setEnteredWord(enteredWord.substring(0, enteredWord.length - 1));
    }
  };

  const keydownHandler2 = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Backspace") {
      setAuthor(author.substring(0, author.length - 1));
    }
  };

  return (
    <div>
      <div className="Create-input-container">
        <label
          className={`Create-input-label${
            !enteredWordIsValid && enteredWord.length > 3 ? " invalid" : ""
          }`}
          htmlFor="enteredWord"
        >
          Word
        </label>
        <input
          className={`Create-input-field${
            !enteredWordIsValid && enteredWord.length > 3 ? " invalid" : ""
          }`}
          name="enteredWord"
          type="text"
          onChange={wordChangeHandler}
          value={enteredWord}
          onKeyDown={keydownHandler}
        />
      </div>
      <div className="Create-input-container">
        <label className="Create-input-label" htmlFor="author">
          Author
        </label>
        <input
          className="Create-input-field"
          name="author"
          type="text"
          onChange={authorChangeHandler}
          value={author}
          onKeyDown={keydownHandler2}
        />
      </div>
      <p>{hint}</p>
      <button
        disabled={!enteredWordIsValid}
        onClick={() => {
          const url = getChallengeUrl(enteredWord, "author");
          if (!navigator.clipboard) {
            setHint(url);
          } else {
            navigator.clipboard
              .writeText(url)
              .then(() => {
                setHint("Challenge link copied to clipboard!");
              })
              .catch(() => {
                setHint(url);
              });
          }
        }}
      >
        Create Challenge link
      </button>
    </div>
  );
};

export default CreateChallenge;
