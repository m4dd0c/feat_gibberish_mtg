# Proposal: Multi-Language Gibberish Generation Using a Statistical Model

## 1. The Goal

To enhance the "Gibberish" Funbox feature to support all languages in Monkeytype, not just English. The generated gibberish should be meaningless but orthographically valid and typeable for each language.

## 2. The Challenge

The current algorithm (randomly picking letters) works for English but fails for languages with complex scripts like Devanagari (Hindi) or Arabic. Randomly combining characters in these languages often produces invalid, un-typeable sequences. For example, stacking multiple vowel signs in Hindi without a base consonant.

Our goal is to generate "plausible nonsense" that respects the unique texture and rules of each language's writing system.

## 3. The Proposed Solution: A Bigram-Based Statistical Generator

Instead of manually defining rules for each language, we can **learn the statistical properties** of each language from its existing wordlist. This is done using a simple **Bigram (Markov Chain) model**.

The process is broken into two phases:

### Phase 1: Offline Analysis (A One-Time Build Step)

We will create a script that runs once during the build process. For each language (e.g., `english.json`, `hindi.json`):

1.  **Read the Wordlist:** The script scans all the words for that language.
2.  **Build a Probability Map:** It creates a simple map that learns "what character tends to follow another."
    *   For English, it learns that after `q` comes `u`, and after `g` can come `g`, `o`, `r`, etc.
    *   For Hindi (`कसम`), it learns that the consonant `स` can follow `क`, and `म` can follow `स`, implicitly handling the schwa vowel.
3.  **Export the Model:** These maps are saved into a single, auto-generated file (`gibberish-models.ts`) that will be bundled with the application.

This step has **zero performance impact** on the end-user as it's done before the code is ever shipped.

### Phase 2: Real-time Generation (In the Browser)

The gibberish generator in `funbox.ts` becomes much simpler and more powerful:

1.  **Load the Right Model:** It selects the pre-built model for the user's chosen language.
2.  **Generate a Word:**
    *   It picks a random starting character from the model.
    *   It looks at the last character and uses the probability map to pick a valid "next" character at random.
    *   It repeats this process until the word reaches a random length.

## 4. Why This Approach is Superior

*   **Truly Scalable:** To add a new language, we just need its wordlist. No new code or manual rules are required. The build script handles the rest.
*   **Higher Quality Gibberish:** The output naturally respects each language's unique patterns (e.g., consonant clusters, double letters like `goog`, valid consonant sequences like `कसम`). It feels more "natural" to type.
*   **Simple and Performant:** The complex analysis is done offline. The real-time generation logic is extremely fast and simple, involving only basic lookups and random choices.
*   **Easy to Maintain:** We no longer need to be experts in the grammatical rules of every language. The data does the work for us.
