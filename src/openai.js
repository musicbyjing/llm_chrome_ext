import { streamText } from "ai";
import { createOpenAI } from '@ai-sdk/openai';

let openAiProvider;

/**
 * Initializes OpenAI with the provided API key.
 * @param {String} openAIApiKey.
 * @returns {void}.
 */
function initializeOpenAI(openAIApiKey) {
  // Vercel API.
  openAiProvider = createOpenAI({
    apiKey: openAIApiKey,
    dangerouslyAllowBrowser: true // Needed for the Chrome extension to work.
  });
  // Signal that the provider is ready.
  document.dispatchEvent(new CustomEvent('openAiProviderReady'));
}

// Retrieves the OpenAI API key, if available.
chrome.storage.sync.get(['openai'], (result) => {
  const openAIApiKey = result.openai;
  if (openAIApiKey) {
    initializeOpenAI(openAIApiKey);
  } else {
    console.log('API key not found, waiting for storage update...');
  }
});

// Updates the OpenAI key if it changes.
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.openai) {
    const openAIApiKey = changes.openai.newValue;
    initializeOpenAI(openAIApiKey);
  }
});

/**
 * Calls an LLM to rewrite the passed-in text.
 * 
 * @param {string} text - The post title.
 * @returns {Promise<ReadableStream>}.
 */
export async function getNewTitle(text) {
  if (!openAiProvider) {
    console.error('openAiProvider is not yet initialized.');
    return;
  }
  try {
    const promptTemplate = `You are a sentiment analyzer app that detects forum posts that are inflammatory, negative,  
      or controversial, and rewrites them, with the goal of making the internet a happier place.

      You are given a title from the post. Decide whether the title is negative or not. If it is negative, rewrite the 
      title so that it's more positive. If it's not negative, return the original title.

      Preserve the original personality of the title, including things like spelling and grammatical errors, etc. You must
      preserve the original meaning as well: e.g. you cannot change the word "layoff" to "hiring spree" even though that is 
      more positive.

      **Your response must only contain a title, nothing else**. Start with this title - \`${text}\`.
      `;
    const { textStream } = await streamText({
      model: openAiProvider('gpt-3.5-turbo'),
      messages: [{ role: 'assistant', content: promptTemplate }]
    });
    return textStream;
  } catch (error) {
    console.error(error);
    return "Error calling LLM.";
  }
}

/**
 * Parses the stream and displays the text as it arrives.
 * 
 * @param {Element} element - The element to update.
 * @param {ReadableStream} stream - The stream from OpenAI.
 * @returns {void}.
 */
export async function displayStreamingText(element, stream) {
  let accumulatedText = '';
  const reader = stream.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log("%%% LLM response accumulatedText:\n" + accumulatedText);
        break;
      }
      if (value) {
        const chunk = value;
        accumulatedText += chunk;
        element.textContent = accumulatedText;
      }
    }
  } catch (error) {
    console.error(error);
    return 'Error in displayStreamingText().';
  }
}