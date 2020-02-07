import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { FileImportButton } from "./Component/FileImportButton";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <FileImportButton
          id="import-split-button"
          buttonText="Import LiveSplit file"
          fileType=".lss"
        />
      </header>
    </div>
  );
};

export default App;
