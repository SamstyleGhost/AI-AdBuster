import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true })

export async function checkAds(url: string) {
  
  const prompt = "You are a very creative and artistic chatbot. You are given an image which is actually an advertisement. You have to describe the contents of the image in a slightly spooky way in about 20-30 words. You can make a rhyme if you want. Do not acknowledge the request. Only return the description."
  
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: url
              }
            }
          ]
        }
      ],
      model: "llama-3.2-11b-vision-preview",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    })

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error)
  }
}

export async function getAdDescription(url: string) {
  console.log(url)
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json', authorization: `Bearer ${import.meta.env.VITE_EDEN_API_KEY}` },
    body: JSON.stringify({
      settings: '{"openai": "gpt-4o-mini"}',
      response_as_dict: true,
      attributes_as_list: false,
      show_base_64: true,
      show_original_response: false,
      temperature: 0.9,
      max_tokens: 200,
      providers: ['openai'],
      file_url: url,
      question: `
        You are a very creative and artistic helper chatbot.
        You are being given an image. You will describe the image in a spooky but accurate way in about 20-30 words. The description should be able to encompass the general idea of the image.
        Do not give wrong descriptions.
      `
    })
  };

  const response = await fetch('https://api.edenai.run/v2/image/question_answer', options)  
  const JSONresponse = await response.json()
  console.log(`Response in utils for url ${url} : `, JSONresponse)
  return JSONresponse.openai.answers[0]
}