# Hackathon AI - Chatbot Backend  

This project is a Node.js-based backend for a chatbot that connects to [Pinecone](https://www.pinecone.io/) for vector search and responds to user queries using the **gpt-4o-mini** model.  

## Getting Started  

### Prerequisites  
- [Node.js](https://nodejs.org/)

### Installation  

1. Clone the repository:  
   ```bash
   git clone https://github.com/mrjoaomarcos/hackathon-ai-backend.git
   cd hackathon-ai-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

### Running the Project

To start the backend server, run:
   ```bash
   node index.js
   ```

### Environment Variables

Make sure to set up the necessary environment variables for:
 - OPENAI_API_KEY
 - PINECONE_API_KEY
 - PINECONE_ENVIRONMENT
 - PINECONE_INDEX