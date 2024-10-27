import { getNewTitle, displayStreamingText } from "./openai";

function execute() {
  const postDivs = document.querySelectorAll("div.pointer-events-none.flex.justify-between.gap-2");
  // const postTitles = document.querySelectorAll("h2.pointer-events-none.line-clamp-3.break-words.text-lg.font-semibold.text-gray-999");
  // const postSnippet = document.querySelectorAll("p.pointer-events-none.line-clamp-1.whitespace-pre-wrap.break-words.text-sm/5.md:line-clamp-3");

  // Temporary testing.
  const postDivsArray = [...postDivs].slice(0, 2);
  console.log("### postDivsArray.length\n" + postDivsArray.length);

  postDivsArray.forEach(async postDiv => {
    const postTitle = postDiv.querySelector("h2").innerText;
    console.log("^^^ postTitle:\n" + postTitle);
    // const postSnippet = postDiv.querySelector("p");
    const summary = await getNewTitle(postTitle);
    if (summary === undefined && summary === "Error calling LLM.") {
      return;
    }
    await displayStreamingText(postTitle, summary);
    // postTitle.textContent = summary;
    // postSnippet.textContent = "Groot is actually the coolest Guardian of the Galaxy.";
  });
}

// /** Execute once */
// execute();

/** Function to trigger useOpenAiProvider only when the provider is ready */
document.addEventListener('openAiProviderReady', () => {
  // Once the provider is initialized, use it
  execute();
});

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