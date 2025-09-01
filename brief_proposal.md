# Proposal: Multi-Language Gibberish Generation

### The Problem
The current gibberish generator is English-only and fails for languages with complex scripts. A new approach is needed to generate plausible, typeable gibberish for all languages.

### The Core Approach: A Bigram Statistical Model

We will use a **Bigram (Markov Chain) model** to learn the statistical "texture" of each language.

1.  **Offline Build Step:**
    *   A script will analyze each language's wordlist (`english.json`, `hindi.json`, etc.).
    *   For each language, it will build a probability map that records which characters are likely to follow any given character.
    *   These maps will be saved as a single, auto-generated data file.

2.  **Real-time Generation:**
    *   The funbox will load the appropriate pre-built map for the user's language.
    *   To generate a word, it will pick a random starting letter, then repeatedly use the map to pick the next letter based on the previous one.

### Benefits
*   **Scalable:** Works for any language with a wordlist. No manual rule-writing.
*   **High-Quality Output:** Naturally produces valid character combinations, consonant clusters, and double letters (e.g., `goog`, `कसम`).
*   **Performant:** The heavy analysis is done offline. The client-side generation is fast and simple.
