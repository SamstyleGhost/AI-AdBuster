import { useEffect, useState } from "react"
import { exorcism, normal, vampire } from "./assets"

type Mode = "default" | "exorcism" | "vampire";
type Model = "llama" | "openai" | "gemini";

function App() {
  
  const [selectedMode, setSelectedMode] = useState<Mode>("default");
  const [selectedModel, setSelectedModel] = useState<Model>("llama");

  // Sends a signal when the mode is changed
  const sendModeChange = (mode: Mode) => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      tabs.forEach(tab => {
        if(tab.id !== undefined) {
          chrome.tabs.sendMessage(tab.id, { type: "changeMode", mode: mode })
        }
      })
    })
  }
  
  // Local storage is integrated to maintain persistence across sessions as well as across multiple tabs
  const handleChange = (mode : Mode) => {
    chrome.storage.local.set({ aiadbustermode: mode }, () => {
      console.log("aiadbustermode mode saved: ", mode)
    })
    setSelectedMode(mode)
    sendModeChange(mode)
  }
  
  const handleModelChange = (model : Model) => {
    chrome.storage.local.set({ aiadbusterllm: model }, () => {
      console.log("aiadbusterllm model saved: ", model)
    })
    setSelectedModel(model);
  }

  // I am changing backgrounds when mode changes
  const getBackgroundImage = () => {
    if(selectedMode === "default") return normal;
    else if(selectedMode === "exorcism") return exorcism;
    else if(selectedMode === "vampire") return vampire;
    else return "";
  }
  
  // Maintaining consistency in frontend
  useEffect(() => {
    chrome.storage.local.get("aiadbustermode", (result) => {
      if (result.aiadbustermode !== "default") {
        setSelectedMode(result.aiadbustermode)
        sendModeChange(result.aiadbustermode);
      }
    });
  }, [])
  
  useEffect(() => {
    chrome.storage.local.get("aiadbusterllm", (result) => {
      if (result.aiadbusterllm !== "llama") {
        setSelectedModel(result.aiadbusterllm)
      }
    });
  }, [])

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
      <div className="choice_title added_margin">
        <p>Choose your LLM:</p>
      </div>
      <div className="llm_choices_container">
        {["llama", "openai", "gemini"].map(model => (
          <button key={model} onClick={() => handleModelChange(model as Model)} className={`${model === selectedModel && "active_model"}`}>{model.charAt(0).toUpperCase() + model.slice(1)}</button>
        ))}
      </div>
    </main>
  );
}

export default App
