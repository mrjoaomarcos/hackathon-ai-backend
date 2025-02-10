require('dotenv').config();

const express = require("express");
const cors = require('cors');
const { OpenAI } = require("openai");
const { Pinecone } = require('@pinecone-database/pinecone');

const app = express();
app.use(express.json());
app.use(cors());

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});
const index = pinecone.Index(process.env.PINECONE_INDEX);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  const userInput = req.body.message;

  const vector = await generate_embeddings(userInput);
  
  // Query Pinecone for relevant context
  const queryResult = await index.query({ vector: vector, topK: 3, includeMetadata: true, });

  if (!queryResult.matches.length) {
    return res.json({ message: "I'm sorry, but I can't find any relevant information." });
  }

  const context = queryResult.matches.map(match => match.metadata.content).join("\n");
  
  // Generate a response using OpenAI GPT
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {
          role: "system",
          content: `
          You are an assistant representing Marlabs, specializing in technology and innovation. 
          Always respond in a friendly, formal, and professional manner, focusing only on company-related topics.
          Avoid unrelated content and hallucinations. If the information is not available, inform the user politely.
          `
        },
        {
          role: "user",
          content: `${context}\n\nQuestion: ${userInput}`
        }
      ],
    max_tokens: 500,
    temperature: 0.5
  });

  const message = response.choices[0]?.message?.content;

  if (message) {
    res.json({ message });
  } else {
    res.status(500).json({ error: "Failed to generate response." });
  }
});


async function generate_embeddings(text) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
  
    return response.data[0].embedding;
  }

app.listen(3000, () => console.log("Server running on port 3000"));