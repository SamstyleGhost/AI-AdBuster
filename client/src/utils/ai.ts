interface ResponseType {
  message: string
}

export async function getAdDescription(url: string) {
  
  let model = ""
  
  chrome.storage.local.get("aiadbusterllm", (result) => {
    if(result.aiadbusterllm === "llama") {
      model = "http://localhost:3000/api/groq";
    } else if(result.aiadbusterllm === "openai") {
      model = "http://localhost:3000/api/openai";
    } else if(result.aiadbusterllm === "gemini") {
      model = "http://localhost:3000/api/gemini";
    } else {
      return "Invalid model selected"
    }
  });

  const response = await fetch(model, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      file_url: url
    })
  })

  const JSONresponse : ResponseType = await response.json()
  return JSONresponse.message
}