import { getNewTitle, displayStreamingText } from "./openai";

function execute() {
  const postDivs = document.querySelectorAll("div.pointer-events-none.flex.justify-between.gap-2");
  // const postTitles = document.querySelectorAll("h2.pointer-events-none.line-clamp-3.break-words.text-lg.font-semibold.text-gray-999");
  // const postSnippet = document.querySelectorAll("p.pointer-events-none.line-clamp-1.whitespace-pre-wrap.break-words.text-sm/5.md:line-clamp-3");

  // Temporary testing.
  const postDivsArray = [...postDivs].slice(0, 2);
  console.log("### postDivsArray.length\n" + postDivsArray.length);

  postDivsArray.forEach(async postDiv => {
    const postElement = postDiv.querySelector("h2");
    const postTitle = postElement.innerText;
    console.log("^^^ postTitle:\n" + postTitle);
    // const postSnippet = postDiv.querySelector("p");
    const summaryStream = await getNewTitle(postTitle);
    if (summaryStream === undefined && summaryStream === "Error calling LLM.") {
      return;
    }
    await displayStreamingText(postElement, summaryStream);
    // postTitle.textContent = summary;
    // postSnippet.textContent = "Groot is actually the coolest Guardian of the Galaxy.";
  });
}

/**
 * Wait for an event to fire. Once fired, resolve the Promise, and only do so once.
 * 
 * @param {String} eventName - The name of the event to wait on.
 * @returns {Promise<void>}.
 */
function waitForEvent(eventName) {
  return new Promise(resolve => document.addEventListener(eventName, resolve, { once: true }));
}

/** Main function. */
async function initialize() {
  await Promise.all([
    // waitForEvent('DOMContentLoaded'),
    waitForEvent('openAiProviderReady')
  ]);
  execute();
}

initialize();

/** Workaround to bypass the initial React issue, but it now executes in a continuous loop. */
// // Options for the observer (which mutations to observe)
// const config = { attributes: true, childList: true, subtree: true };

// // Callback function to execute when mutations are observed
// const callback = function (mutationsList, observer) {
//   // Use traditional 'for loops' for IE 11
//   for (const mutation of mutationsList) {
//     execute();
//   }
// };

// // Create an observer instance linked to the callback function
// const observer = new MutationObserver(callback);

// // Start observing the target node for configured mutations
// observer.observe(document, config);