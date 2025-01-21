import dotenv from "dotenv"
dotenv.config()

import express from 'express'
import { handleGeminiCall, handleGroqCall, handleOpenAICall } from "./handlers/handlers.js";

const app = express();
app.use(express.json());

app.post("/api/groq", async (req, res) => {
  const { file_url } = req.body;

  if(!file_url) res.status(400).json({ message: "No spookiness going on over here!!" })
  
  try {
    const response = await handleGroqCall(file_url)
    res.status(200).json({ message: response })
  } catch (error) {
    res.status(500).json({ message: "This ad doesnt like Halloween!" })
  }
});

app.post("/api/openai", async (req, res) => {
  const { file_url } = req.body;

  if(!file_url) res.status(400).json({ message: "No spookiness going on over here!!" })
  
  try {
    const response = await handleOpenAICall(file_url)
    res.status(200).json({ message: response })
  } catch (error) {
    res.status(500).json({ message: "This ad doesnt like Halloween!" })
  }
})

app.post("/api/gemini", async (req, res) => {
  const { file_url } = req.body;

  if(!file_url) res.status(400).json({ message: "No spookiness going on over here!!" })
  
  try {
    const response = await handleGeminiCall(file_url)
    res.status(200).json({ message: response })
  } catch (error) {
    res.status(500).json({ message: "This ad doesnt like Halloween!" })
  }
})

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});