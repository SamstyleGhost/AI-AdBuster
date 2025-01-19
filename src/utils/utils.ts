import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true })

export async function checkAds(ids : string[]) {
  const prompt = `You are a web assistant that can tell whether a HTML element is a part of an advertisement. You are given an array of HTML div's id fields here:\n
  ${ids}\n

  What I want you to return is an array of the id's that are part of an advertisement service. Only return the array and no extra content. Do not explain or add any other text. Just return an array of strings.
  `

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    })

    return response.choices[0].message;
  } catch (error) {
    console.error(error)
  }
}

export async function getAdDescription(url: string) {
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json', authorization: `Bearer ${import.meta.env.VITE_EDEN_API_KEY}` },
    body: JSON.stringify({
      settings: '{"openai": "gpt-4o-mini"}',
      response_as_dict: true,
      attributes_as_list: false,
      show_base_64: true,
      show_original_response: false,
      temperature: 0,
      max_tokens: 200,
      providers: ['openai'],
      file_url: url,
      question: "Give me a spooky but accurate description of this image in about 20-30 words"
    })
  };

  const response = await fetch('https://api.edenai.run/v2/image/question_answer', options)  
  const JSONresponse = await response.json()
  console.log("Response in utils: ", JSONresponse)
  return JSONresponse.openai.answers[0]
}