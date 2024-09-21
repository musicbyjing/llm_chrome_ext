import { OpenAIStream, StreamingTextResponse, streamText } from "ai";
import { openai } from '@ai-sdk/openai';
import { OpenAI } from "openai";

let openAiClient;

// Retrieve the OpenAI API key.
chrome.storage.sync.get(['openai'], (result) => {
  const openAIApiKey = result.openai;
  openAiClient = new OpenAI({
    apiKey: openAIApiKey,
    dangerouslyAllowBrowser: true // Needed for the Chrome extension to work.
  });
});

// Update the OpenAI key if it changes.
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.openai) {
    const openAIApiKey = changes.openai.newValue;
    openAiClient = new OpenAI({
      apiKey: openAIApiKey,
      dangerouslyAllowBrowser: true,
    });
  }
});

///////////////////
// - UPDATE THE ABOVE TO USE VERCEL
// - USE CUSTOM VERCEL MODEL WITH API KEY INSIDE GET_NEW_TITLE
// - MAY HAVE SOME ISSUES WITH DANGEROUSLYALLOWBROWSER OPTION
// - NO NEED FOR READ_FROM_STREAM FUNCTION
///////////////////

/**
 * Calls an LLM to rewrite the passed-in text.
 * 
 * @param {string} text - The post title.
 * @returns 
 */
export async function getNewTitle(text) {
  try {
    const promptTemplate = `You are a sentiment analyzer app that detects forum posts that are inflammatory and negative, 
      with the goal of making the internet a happier place. 

      You are given a title from the post. Decide whether the title is negative or not. If it is negative, rewrite the 
      title and content so that it's more positive. If it's not negative, return the original title.

      Preserve the original personality of the title, including things like spelling and grammatical errors, etc.

      Start with this title - ${text}.
      `;

    const stream = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [{ role: 'assistant', content: promptTemplate }]
    });

    // Vanilla OpenAI API
    // const completion = await openAiClient.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'assistant', content: promptTemplate }],
    //   stream: true, // Turn on the stream
    // });

    // const stream = OpenAIStream(completion);
    const response = stream.toDataStreamResponse();
    if (response.ok && response.body) {
      return await response.text();
    }
  } catch (error) {
    console.error(error);
    return "Error calling LLM.";
  }
}