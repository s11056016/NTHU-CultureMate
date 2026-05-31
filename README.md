# NTHU CultureMate

NTHU CultureMate is an MVP of a RAG-style cultural adaptation support system for National Tsing Hua University international students. It focuses on three practical transition areas:

- **Food**: ordering language and Taiwanese food culture.
- **Campus**: NTHU insurance, scholarship, and campus office guidance.
- **Social**: low-pressure conversation topics and cultural notes for making friends.

The app is intentionally lightweight: it runs as a static web app and uses a local curated knowledge base plus transparent source metadata to demonstrate the retrieval-and-generation flow before connecting to a production vector database or LLM.

## MVP Features

1. Home screen with **Food**, **Campus**, **Social**, and **Ask Anything** entry points.
2. Curated phrase cards with Traditional Chinese, pinyin, English meaning, usage context, and cultural notes.
3. A browser-side retrieval pipeline that ranks knowledge snippets by module, keywords, multilingual aliases, and question overlap.
4. A consistent answer format:
   - Short Answer
   - Useful Chinese Sentence
   - Pinyin
   - English Meaning
   - When to Use
   - Cultural Note
   - Source / Last Updated
5. Official-source-first campus entries with conservative guidance for insurance and scholarships.

## Run Locally

```bash
npm start
```

Then open <http://localhost:4173>.

## Test

```bash
npm test
```

The tests validate retrieval ranking, answer formatting, and source metadata for the knowledge base.

## Data and Safety Notes

- Campus information is treated as high-stakes guidance. The demo includes official NTHU source URLs and tells students to verify status-specific questions with the relevant NTHU office.
- Culture and language examples are curated for common low-risk situations.
- Future production versions should replace the local scorer with a vector database and a generation model that cites retrieved chunks.

## Official Sources Used in the Seed Knowledge Base

- NTHU Student Insurance page: <https://apply.nthu.edu.tw/en/article/148-insurance>
- NTHU scholarship FAQ: <https://ibp.nthu.edu.tw/faq-9.html>
- NTHU scholarships listing: <https://apply.nthu.edu.tw/en/articles/nthu-scholarships?type=scholarship>
- NTHU contact information: <https://apply.nthu.edu.tw/en/article/99-information>
