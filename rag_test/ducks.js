// Using Google's text embeddings
const { TextEmbeddingModel } = require('@google-ai/generativelanguage');
const { GoogleAuth } = require('google-auth-library');

const MODEL_NAME = 'models/embedding-001';
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

const embeddingModel = new TextEmbeddingModel({
  auth,
});

async function embedText(text) {
  const response = await embeddingModel.embedText({
    text: text,
  });
  return response.embedding.values;
}