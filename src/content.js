import { getNewTitle, displayStreamingText } from "./openai";

/**
 * Calls OpenAI to update a postDiv's title in a streaming fashion.
 * 
 * @param {Element} postDiv 
 * @returns {Promise<void>}.
 */
async function processTitle(postDiv) {
  const postElement = postDiv.querySelector("h2");
  const postTitle = postElement.innerText.trim();
  // const postSnippet = postDiv.querySelector("p");
  console.log("$$$ original postTitle:\n" + postTitle);
  const summaryStream = await getNewTitle(postTitle);
  if (summaryStream === undefined && summaryStream === "Error calling LLM.") {
    return;
  }
  await displayStreamingText(postElement, summaryStream);
}

/**
 * MutationObserver catches dynamically loading content. Only once a post title is loaded should we call OpenAI to rewrite it.
 */
const targetSelector = "div.pointer-events-none.flex.justify-between.gap-2";

// Callback executes when mutations are observed.
const callback = async function (mutationsList, observer) {
  mutationsList.forEach(mutation => {
    const postDivs = mutation.target.querySelectorAll(targetSelector);
    // TODO: Remove sliced array.
    // const postDivsArray = [...postDivs].slice(0, 2);
    const postDivsArray = postDivs;
    console.log("### postDivsArray.length\n" + postDivsArray.length);
    //
    postDivsArray.forEach(async (postDiv) => {
      if (!postDiv.hasAttribute('processed')) { // Only process once per postDiv.
        postDiv.setAttribute('processed', 'true');
        await processTitle(postDiv);
      }
    });
  });
};

// Creates an observer instance linked to the callback function.
const observer = new MutationObserver(callback);

// Starts observing the target node for configured mutations.
document.addEventListener('openAiProviderReady', () => {
  observer.observe(document.body, { childList: true });
});