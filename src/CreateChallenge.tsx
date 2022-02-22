import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import { dictionarySet, getChallengeUrl, makeMysteryBoard } from "./util";

const CreateChallenge = () => {
  const [hint, setHint] = useState("Enter a word (4-7 letters)");
  const [enteredWord, setEnteredWord] = useState("");
  const [author, setAuthor] = useState("");
  const [enteredWordIsValid, setEnteredWordIsValid] = useState(false);

  useEffect(() => {
    const checkEnteredWordValidity = (): void => {
      if (enteredWord.length < 4) {
        setHint("Enter a word (4-7 letters)");
        setEnteredWordIsValid(false);
      } else if (enteredWord.length > 7) {
        setHint("Maximum length is 7 letters!");
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
	let target = "" + event.target.value;
    setEnteredWord(target.toLowerCase());
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
	  <p>{hint}</p>
	  <div id="createForm">
		  <div className="Create-input-container">
			<label
			  className={`Create-input-label${
				!enteredWordIsValid && enteredWord.length > 3 ? " invalid" : ""
			  }`}
			  htmlFor="enteredWord"
			>
			  Word
			</label>
			<span><input
			  className={`Create-input-field${
				!enteredWordIsValid && enteredWord.length > 3 ? " invalid" : ""
			  }`}
			  name="enteredWord"
			  type="text"
			  onChange={wordChangeHandler}
			  value={enteredWord}
			  onKeyDown={keydownHandler}
			/></span>
		  </div>
		  <div className="Create-input-container">
			<label className="Create-input-label" htmlFor="author">
			  Author
			</label>
			<span><input
			  className="Create-input-field"
			  name="author"
			  type="text"
			  onChange={authorChangeHandler}
			  value={author}
			  onKeyDown={keydownHandler2}
			/></span>
		  </div>
	  </div>
      <button
        disabled={!enteredWordIsValid}
        onClick={() => {
          const url = getChallengeUrl(enteredWord, author);
          if (!navigator.clipboard) {
            setHint(url);
          } else {
			      // wrap URL in a message
			      let mysteryBoard = makeMysteryBoard(enteredWord.length);
			      let msg = "Play my #DIYwordle: "+url+" \n"+mysteryBoard;

            if(
              /android|iphone|ipad|ipod|webos/i.test(navigator.userAgent) &&
              !/firefox/i.test(navigator.userAgent)
            ) {
              navigator.share({ text: msg }).then(() => {
                return;
              }).catch(() => {
                setHint(url);
              });
            }
            else {
              navigator.clipboard
                .writeText(msg)
                .then(() => {
                  setHint("Challenge link copied to clipboard!");
                })
                .catch(() => {
                  setHint(url);
                });
            }
          }
        }}
      >
        Create my DIY Wordle link
      </button>
    </div>
  );
};

export default CreateChallenge;
