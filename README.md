# Inspiration
Ingredients (especially in skincare, cosmetics, and medicine!) are overwhelming.  With thousands of obscure ingredients and conflicting advice, users need a neutral, science-backed tool to decode ingredient labels.  LabelLens was born to democratize ingredient literacy!

# What it does
LabelLens empowers its users by allowing for simple, un-biased, and convenient way to look up ingredients.  Users can either take a picture of an ingredient list to get a quick summary of each ingredient, look up a specific product's information and ingredients, or look up a specific ingredient themselves.

# Market Research
Most competitors fail users in two ways:
- Bias for Profit: Many apps quietly partner with brands, skewing results or hiding unfavorable data.
- Stale Data: Manual updates can’t keep pace with new ingredients (e.g., vegan alternatives, novel actives).

LabelLens combats both with:
- RAG + Google Gemini: Our AI cross-references real-time research and vetted databases, avoiding human curation bias.
- Zero Brand Partnerships: We prioritize user trust over monetization, ensuring analyses are never influenced by third parties.

# How we built it
- React.js with Tailwind for the frontend
- Node.js for the backend
- Google Gemini and GCP (Docker, Kubernetes) for the AI, Weaviate for the vector database
- Data was collected from various reputable sources, such as the FDA.

# How to run
1. Clone the repository
```bash
git clone https://github.com/your-username/LabelLens.git
```
2. Navigate to the project directory
```bash
cd LabelLens
```

3. Create a .env file with your API key
```env
VITE_GOOGLE_API_KEY=<YOUR_KEY_HERE>
```

4. Install dependencies
```bash
npm install
```

5. Start the development server
```bash
npm run dev
```

# Challenges we ran into
- Finding and acquiring appropriate (non-biased) datasets of ingredient side-effects for retrieval augmented generation (RAG).  
- no food

# Accomplishments that we're proud of
- We're proud to have learned to combine custom RAG algorithms with Google Gemini 

# What We Learned
- Cursor is a good AI

# What's next for LabelLens
- Comparing two items (e.g. If two items are )
- Providing alternatives (e.g. I like a product, but it contains an ingredient I do not like, is there an alternative of the same level(?) but without the ingredient?)