import {
  gibberishModels,
  languageToCharsetMap,
} from "./static/bigrams/gibberish-models-using-set.js";

const randomIntFromRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomElementFromArray = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Generates a random gibberish word using a bigram model based on the selected language.
 * @param language The current language (e.g., "english_10k", "hindi_1k").
 * @returns A generated gibberish word.
 */
export function getGibberishWord(language) {
  // 1. Find the correct charset (e.g., "latin", "devanagari") for the given language.
  const charset = languageToCharsetMap[language] || "latin";
  const model = gibberishModels[charset];

  // 2. Fallback to old method if the model is missing or invalid.
  if (!model || model.starters.length === 0) {
    console.error(
      `Gibberish model for charset "${charset}" is missing or invalid.`,
    );
  }

  // 3. Generate the word using the Bigram model.
  const length = randomIntFromRange(3, 10);
  let word = randomElementFromArray(model.starters);

  while (word.length < length) {
    const lastChar = word[word.length - 1];
    const followers = model.followers[lastChar];

    // If we hit a character with no known followers, end the word.
    if (!followers || followers.length === 0) {
      break;
    }

    const nextChar = randomElementFromArray(followers);
    word += nextChar;
  }

  return word;
}
