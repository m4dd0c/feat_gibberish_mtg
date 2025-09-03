After our last discussion, I've been thinking about a more robust way to handle multi-language gibberish. Instead of manual charset ranges, which can get complex, I'm proposing a new method using a **Bigram (Markov Chain) model** to learn the statistical "texture" of each language.

### Approach:

**Offline Build Step:**
I'll create a script that runs during the build process to analyze each language's wordlist (english_10k.json, hindi_1k.json, etc.).

For each language, it will build a probability map that records which characters are likely to follow any given character. This is essentially learning the language's phonetic and structural rules automatically.

These maps will then be compiled into a single, auto-generated data file.

> [!NOTE]
> The script will handle a single variant of a language. e.g., If it runs for `english_10k` then ignore others `english_1k, english_5k, english_25k, and english_450k`.
> Also, to optimize the generated file further, we are using a probability map instead of putting redundant characters. 

**Real-time Generation:**
When the gibberish funbox is activated, it will load the appropriate pre-built map for the user's selected language.

To generate a word, it will pick a random starting letter, then repeatedly use the probability map to select the next letter based on the previous one.

**Benefits**
Truly Scalable: This model works for any language that has a wordlist. No more manual rule-writing or trying to figure out complex character interactions. We just point the script to a wordlist, and it works.

High-Quality Output: This method will naturally produce valid character combinations, including consonant clusters and double letters (e.g., goog in English or कसम in Hindi), because it's learning from real-world data.

Performant: All the heavy analysis is done offline. The client-side generation is incredibly fast and simple.
