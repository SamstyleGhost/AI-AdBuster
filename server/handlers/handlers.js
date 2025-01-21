import axios from "axios";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const handleGroqCall = async (url) => {
  
  const prompt = `You are a very creative and artistic chatbot. You are given an image which is actually an advertisement. You have to describe the contents of the image in a slightly spooky way in about 20-30 words. You can make a rhyme if you want. 
  Do not acknowledge the request. Only return the description.`
  
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
      temperature: 0.8,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    })
    
    const groqResponse = response.choices[0].message.content;
    if(groqResponse === null) {
      throw new Error("Error")
    }
    console.log(groqResponse)
    return groqResponse; 
  } catch (error) {
    console.error(error)
    throw new Error("Error fetcing data")
  }
}

export const handleOpenAICall = async (url) => {
  
  const prompt = `
    You are a very creative and artistic helper chatbot.
    You are being given an image. You will describe the image in a spooky but accurate way in about 20-30 words. The description should be able to encompass the general idea of the image.
    Do not give wrong descriptions.
  `
  
  const options = {
    method: 'POST',
    url: "https://api.edenai.run/v2/image/question_answer",
    headers: {
      Authorization: `Bearer ${process.env.EDEN_API_KEY}`
    },
    data: {
      settings: '{"openai": "gpt-4o-mini"}',
      response_as_dict: true,
      attributes_as_list: false,
      show_base_64: true,
      show_original_response: false,
      temperature: 0.9,
      max_tokens: 200,
      providers: ['openai'],
      file_url: url,
      question: prompt
    }
  };
  
  try {
    const response = await axios.request(options);
    
    const openResponse = response.data.openai.answers[0]
    if(openResponse === null || openResponse === undefined) {
      throw new Error("Error")
    }

    return openResponse;
  } catch (error) {
    console.error(error)
    throw new Error("Error fetcing data")
  }
}

export const handleGeminiCall = async (url) => {
  
  const prompt = `
    You are a very creative and artistic helper chatbot.
    You are being given an image. You will describe the image in a spooky but accurate way in about 20-30 words. The description should be able to encompass the general idea of the image.
    Do not give wrong descriptions.
  `
  
  const options = {
    method: 'POST',
    url: "https://api.edenai.run/v2/image/question_answer",
    headers: {
      Authorization: `Bearer ${process.env.EDEN_API_KEY}`
    },
    data: {
      settings: '{"google": "gemini-1.5-flash"}',
      response_as_dict: true,
      attributes_as_list: false,
      show_base_64: true,
      show_original_response: false,
      temperature: 0.9,
      max_tokens: 200,
      providers: ['google'],
      file_url: url,
      question: prompt
    }
  };
  
  try {
    const response = await axios.request(options);
    
    const openResponse = response.data.google.answers[0]
    if(openResponse === null || openResponse === undefined) {
      throw new Error("Error")
    }

    return openResponse;
  } catch (error) {
    console.error(error)
    throw new Error("Error fetcing data")
  }
}