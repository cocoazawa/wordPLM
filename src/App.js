/*
This code is written by Peter Go, and brought to life by React.
Iteration wplm0a2 (tracked starting on alpha 1)

This code is publicly available on GitHub for viewing, and pull requesting, etc. 
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
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const randUUID = getRandomInt(100000);

const app = initializeApp(firebaseConfig);
const firebaseApp = getApp();
const storage = getStorage(firebaseApp, "gs://word-plm.appspot.com");
var textRef = ref(storage, `testingSession/${randUUID}.txt`)

var counterWord = 1;
var counterWA = -1;
var entryCounter = 0;

var givenName = "";
var counterCors = 0;
var allInput = [];

var quizNum = 0;
var doneQuiz = false;
var uploadProceedOkay = true;

var startTime = 0;
var endTime = 0;


// Actual App
function App() {

  const wordNumArray = ["1", "."];
  const correctWords = ["upbraid", "Upbraid", "copacetic", "Copacetic", "embargo", "Embargo", "pundit", "Pundit", "caustic", "Caustic", "oxymoron", "Oxymoron",  "assay", "Assay", "myriad", "Myriad"];
  const wordActualArray = ["find fault with (someone)", "in excellent order", "an official ban on trade or other commercial activity with a particular country", "an expert in a particular subject or field who is frequently called on to give opinions about it to the public", "able to burn or corrode organic tissue by chemical action", "a figure of speech in which apparently contradictory terms appear in conjunction", "the testing of a metal or ore to determine its ingredients and quality", "a countless or extremely great number"];
  var [entryText, setEntry] = useState("");

  // Handling Text Input
  const handleText = (event) => {
    setEntry(event.target.value);
    console.log(`Text Handler      - Entry: ${entryText}`);
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
      entmesRef.innerHTML = `Entered as ${givenName}!`;
      entmesRef.classList.add("entryGraphics");
      entryCounter += 3;
      inputRef.placeholder = "Enter your answer here."
    }
  }

  // Uploading the Text using the textRef, although is likely to be changed in later iterations.
  function uploadText() {
    var inputRef = document.getElementById("entryText");

    if (entryText.length > 0) {
      console.log(`Upload Text       - Uploading ${entryText}...`);
      allInput.push(entryText);

      entryMessage();
      updateWord();
      
      inputRef.value = "";
      inputRef.focus();

      console.log(`Upload Text       - All Input ${allInput}`);
      
      if (doneQuiz === true && uploadProceedOkay === true) {
        var allInputString = `${allInput}`;
        uploadString(textRef, allInputString).then((snapshot) => {
          console.log('Upload Text       - Upload Success: Uploaded a raw string!');
        });
        uploadProceedOkay = false;
      } else {
        console.log(`Upload Text       - Upload Stopped: Error upload_turned_off.`);
      }
    }
  }

  // Test function to toggle a div. Make sure to do "var variableName = docu..." not "variableName = docu..."
  function updateWord() {
    console.log("Update Word      - Updating Word...")
    var messageRef = document.getElementById("entryMessage");
    var buttonRef = document.getElementById("proceedButton");
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

      endTime = Date.now();
    } else if (counterWord === 1) {
      if (quizNum === 1) {
        inputRef.style.display = "none";
        wordNumRef.style.display = "none";
        wordActualRef.style.display = "none";
        progCouRef.style.display = "none";
        buttonRef.innerHTML = "Finished ⚡️";
        noteRef.innerHTML = "You have completed the quiz! Here are your statistics:";

        const delta = endTime - startTime;
        var deltaProc = Math.floor(delta/10);
        deltaProc = deltaProc/100;

        evaluationEngine();

        messageRef.innerHTML = `Time to completion: ${deltaProc} seconds. Score: ${counterCors}/8.`;
        messageRef.style.opacity = "1";
        doneQuiz = true;
      }

      startTime = Date.now();

      inputRef.placeholder = "Look at the board before you start! (yes, please type your answer here)";
      counterWord += 1;
      counterWA = 0;
    } else {
      inputRef.placeholder = "Enter your answer here.";
      counterWord += 1;
      counterWA += 1;
    }
    
    console.log(`Update Word      - Counter: ${counterWA}`);

    wordActualRef.innerHTML = wordActualArray[counterWA];
  }

  function evaluationEngine() {
    for (let i = 0; i < 9; i++) {
      var tempVocab = allInput[i+1];
      var tempCorrectBool = correctWords.includes(tempVocab); 
      if (tempCorrectBool === true) {
        console.log(`Evaluation Engine - Correct Word: ${tempVocab}`);
        counterCors++;
      } else {
        console.log(`Evaluation Engine - Wrong Word: ${tempVocab}`);
      }
    }
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
        <p className="wordNum noteC">Version 2a1. Coded and built with internet magic by Peter Go.</p>
      </div>
    </div>
  );
}

export default App;