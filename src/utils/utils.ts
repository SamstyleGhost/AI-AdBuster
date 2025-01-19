import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true })

export async function checkAds(ids : string[]) {
  const prompt = `You are a web assistant that can tell whether a HTML element is a part of an advertisement. You are given an array of HTML div's id fields here:\n
  ${ids}\n

  What I want you to return is an array of the id's that are part of an advertisement service. Only return the array and no extra content. Do not explain or add any other text. Just the array.
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