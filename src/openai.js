import { OpenAIStream, StreamingTextResponse, streamText } from "ai";
import { createOpenAI, openai } from '@ai-sdk/openai';
import { OpenAI } from "openai";

let openAiProvider;

function initializeOpenAI(openAIApiKey) {
  // Vercel.
  openAiProvider = createOpenAI({
    apiKey: openAIApiKey,
    dangerouslyAllowBrowser: true // Needed for the Chrome extension to work.
  });
  // Signal that the provider is ready.
  document.dispatchEvent(new CustomEvent('openAiProviderReady'));
  // Vanilla OpenAI API.
  // openAiProvider = new OpenAI({
  //   apiKey: openAIApiKey,
  //   dangerouslyAllowBrowser: true // Needed for the Chrome extension to work.
  // });
}

// Retrieve the OpenAI API key, if available.
chrome.storage.sync.get(['openai'], (result) => {
  const openAIApiKey = result.openai;
  if (openAIApiKey) {
    // console.log("%%% get openAIApiKey: " + openAIApiKey);
    initializeOpenAI(openAIApiKey);
  } else {
    console.log('API key not found, waiting for storage update...');
  }
});

// Update the OpenAI key if it changes.
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.openai) {
    const openAIApiKey = changes.openai.newValue;
    // console.log("%%% onChanged openAIApiKey: " + openAIApiKey);
    initializeOpenAI(openAIApiKey);
  }
});

///////////////////
// - MAY HAVE SOME ISSUES WITH DANGEROUSLYALLOWBROWSER OPTION
///////////////////

/**
 * Calls an LLM to rewrite the passed-in text.
 * 
 * @param {string} text - The post title.
 * @returns {ReadableStream}.
 */
export async function getNewTitle(text) {
  if (!openAiProvider) {
    console.error('openAiProvider is not yet initialized.');
    return;
  }
  try {
    const promptTemplate = `You are a sentiment analyzer app that detects forum posts that are inflammatory and negative, 
      with the goal of making the internet a happier place. 

      You are given a title from the post. Decide whether the title is negative or not. If it is negative, rewrite the 
      title so that it's more positive. If it's not negative, return the original title.

      Preserve the original personality of the title, including things like spelling and grammatical errors, etc.

      **Your response must only contain a title**. Start with this - \`${text}\`.
      `;
    // console.log("$$$\n" + promptTemplate);
    // console.log("$$$\n" + openAiProvider);
    // console.log("$$$\n" + chrome.storage.sync);

    const stream = await streamText({
      model: openAiProvider('gpt-3.5-turbo'),
      messages: [{ role: 'assistant', content: promptTemplate }]
    });
    return stream;
  } catch (error) {
    console.error(error);
    return "Error calling LLM.";
  }
}

/**
 * Parses the stream and displays the text as it arrives.
 * 
 * @param {Element} element - The element to update.
 * @param {StreamTextResult} response - The stream from OpenAI.
 * @returns {void}.
 */
export async function displayStreamingText(element, response) {
  let accumulatedText = '';
  const reader = response.textStream.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        element.textcontent = "I AM GROOT.";
        const chunk = value;
        accumulatedText += chunk;
        console.log("%%% accumulatedText:\n" + accumulatedText);
        // element.textContent = accumulatedText;
      }
    }
  } catch (error) {
    console.error(error);
    return 'Error in displayStreamingText().';
  }

}