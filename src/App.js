/*
This code is written by Peter Go, and brought to life by React.
Iteration wplm0a2 (tracked starting on alpha 1)

This code is publicly available on GitHub for viewing, and pull requesting, etc. 


Table:

\begin{table}[]
\begin{tabular}{ll}
Word      & Definition                                                                                                     \\
upbraid   & find fault with (someone)                                                                                      \\
copacetic & in excellent order                                                                                             \\
embargo   & an official ban on trade or other commercial activity with a particular country                                \\
pundit    & an expert in a particular subject or field who is frequently called on to give opinions about it to the public \\
caustic   & able to burn or corrode organic tissue by chemical action                                                      \\
oxymoron  & a figure of speech in which apparently contradictory terms appear in conjunction                               \\
assay     & the testing of a metal or ore to determine its ingredients and quality                                         \\
myriad    & a countless or extremely great number                                                                         
\end{tabular}
\end{table}


*/


// Import all needed libraries (Firebase, React, CSS, etc.)
import { initializeApp,getApp } from "firebase/app";
import { getStorage,ref,uploadString } from "firebase/storage";
import { useState } from "react";
import './App.css';

// Firebase Config. Not important, and will only be used by Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyDEJAaLNU5ClLwqbBhAKMRivHNARSgl7I4",
  authDomain: "word-plm.firebaseapp.com",
  projectId: "word-plm",
  storageBucket: "word-plm.appspot.com",
  messagingSenderId: "74811087581",
  appId: "1:74811087581:web:b7425b91ef8fa14c77d934",
  measurementId: "G-7JEE15J0SE"
};

// Initialize Firebase, Firestore, etc.
const app = initializeApp(firebaseConfig);
const firebaseApp = getApp();
const storage = getStorage(firebaseApp, "gs://word-plm.appspot.com");
const textRef = ref(storage, "testingSession/")

var counterWord = 1;
var counterWA = -1;
var entryCounter = 0;

var givenName = "";

var allInput = [];

var quizNum = 0;
var doneQuiz = false;


// Actual App
function App() {

  const wordNumArray = ["1", "."];
  const wordActualArray = ["find fault with (someone)", "in excellent order", "an official ban on trade or other commercial activity with a particular country", "an expert in a particular subject or field who is frequently called on to give opinions about it to the public", "able to burn or corrode organic tissue by chemical action", "a figure of speech in which apparently contradictory terms appear in conjunction", "the testing of a metal or ore to determine its ingredients and quality", "a countless or extremely great number"];
  var [entryText, setEntry] = useState("");

  // Handling Text Input
  const handleText = (event) => {
    setEntry(event.target.value);
    console.log(entryText);
  }

  function enterKeyUp(e) {
    if (e.key === "Enter") {
      uploadText();
    }
  }

  function entryMessage() {
    var inputRef = document.getElementById("entryText");
    var entmesRef = document.getElementById("note"); 

    givenName = entryText;
    if (entryCounter < 1) {
      entmesRef.innerHTML = `Entered as ${givenName}! エントリーしました！`;
      entmesRef.classList.add("entryGraphics");
      entryCounter += 3;
      inputRef.placeholder = "Enter your answer here."
    }
  }

  // Uploading the Text using the textRef, although is likely to be changed in later iterations.
  function uploadText() {
    var inputRef = document.getElementById("entryText");

    if (entryText.length > 0) {
      console.log(`Uploading ${entryText}...`);
      allInput.push(entryText);

      entryMessage();
      updateWord();
      
      inputRef.value = "";
      inputRef.focus();

      console.log(allInput);
      console.log(`Upload Stopped - Error upload_turned_off.`);

      if (doneQuiz === true) {
        uploadString(textRef, entryText).then((snapshot) => {
          console.log('Uploaded a raw string!');
        });
      }
    }
  }

  // Test function to toggle a div. Make sure to do "var variableName = docu..." not "variableName = docu..."
  function updateWord() {
    console.log("Updating Word...")
    var noteRef = document.getElementById("note"); 
    var inputRef = document.getElementById("entryText");
    var wordNumRef = document.getElementById("wordNum");
    var progCouRef = document.getElementById("progressCounter");
    var wordActualRef = document.getElementById("wordActual");

    wordNumArray.reverse();
    wordNumArray.pop();
    wordNumArray.push(`${counterWord}`);
    wordNumArray.reverse();
    wordNumRef.innerHTML = wordNumArray.join("");
    progCouRef.innerHTML = `${counterWord}/8`;

    if (counterWord === 8) {
      quizNum += 1;
      counterWord = 1;
      counterWA = 7;

      if (quizNum === 3) {
        inputRef.style.display = "none";
        wordNumRef.style.display = "none";
        wordActualRef.style.display = "none";
        progCouRef.style.display = "none";
        noteRef.innerHTML = "You have completed the quiz! Here are your statistics:"
      }
    } else if (counterWord === 1) {
      inputRef.placeholder = "Look at the board before you start! (yes, please type your answer here)";
      counterWord += 1;
      counterWA = 0;
    } else {
      inputRef.placeholder = "Enter your answer here.";
      counterWord += 1;
      counterWA += 1;
    }
    
    console.log(counterWA);

    wordActualRef.innerHTML = wordActualArray[counterWA];
  }

  // Return, or the actual code visible to the user. 
  return (
    <div className="App">
      <div>
        <h1 className="wordTitle">WordPLM - Quiz</h1>
        <div className="wordDiv">
          <div className="wordDivDef">
            <p className="wordNum" id="wordNum">Entry. </p><p className="wordActual" id="wordActual">Type your name below to begin.</p>
          </div>
          <p className="wordNum progressCounter" id="progressCounter">0/8</p>
        </div>
        <p className="wordNum noteB" id="note">Note: Wait in this stage.</p>
        <input className="wordInput" type="text" id="entryText" name="entryText" onChange={handleText} onKeyUp={enterKeyUp} placeholder="Enter your name here."></input>
        <p className="entryMessage" id="entryMessage"></p>
        <button type="submit" className="nextButton" id="proceedButton" onClick={uploadText}>Proceed ▶</button>
        <p className="wordNum noteC">Version 1a4. Currently 3 non-fatal errors (highVul). Coded and built with internet magic by Peter Go.</p>
      </div>
    </div>
  );
}

export default App;