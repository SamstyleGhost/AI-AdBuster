import { useState } from "react"
import { exorcism, normal, vampire } from "./assets"

type Mode = "default" | "exorcism" | "vampire"

function App() {
  
  const [selectedMode, setSelectedMode] = useState<Mode>("default")

  const sendModeChange = (mode: Mode) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if(tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "changeMode", mode: mode })
      }
    })
  }
  
  const handleChange = (mode : Mode) => {
    setSelectedMode(mode)
    sendModeChange(mode)
  }

  const getBackgroundImage = () => {
    if(selectedMode === "default") return normal;
    else if(selectedMode === "exorcism") return exorcism;
    else if(selectedMode === "vampire") return vampire;
    else return "";
  }

  return (
    <main>
      <img src={getBackgroundImage()} className="bg_image" />
      <div className="title">
        <p>AI AdBuster</p>
      </div>
      <div className="choice_title">
        <p>Choose your mode:</p>
      </div>
      <div className="mode_choices_container">
        {["default", "vampire", "exorcism"].map(mode => (
          <button key={mode} onClick={() => handleChange(mode as Mode)} className={`${mode === selectedMode && "active_mode"}`}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</button>
        ))}
      </div>
    </main>
  );
}

export default App
