interface ResponseType {
  message: string
}

// Will check which AI agent the user wants and call the API accordingly
async function getModelUrl() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("aiadbusterllm", (result) => {
      if (result.aiadbusterllm === "llama") {
        resolve("http://localhost:3000/api/groq");
      } else if (result.aiadbusterllm === "openai") {
        resolve("http://localhost:3000/api/openai");
      } else if (result.aiadbusterllm === "gemini") {
        resolve("http://localhost:3000/api/gemini");
      } else {
        reject("Invalid model selected");
      }
    });
  });
}

export async function getAdDescription(url: string) {
  
  try {
    const model = await getModelUrl();
    const response = await fetch(model, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        file_url: url
      })
    })

    const JSONresponse: ResponseType = await response.json()
    return JSONresponse.message
  } catch (error) {
    console.error(error)  
    return "No Halloween tonight!"
  }

}