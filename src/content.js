function execute() {
  const postDivs = document.querySelectorAll("div.pointer-events-none.flex.justify-between.gap-2");
  // const postTitles = document.querySelectorAll("h2.pointer-events-none.line-clamp-3.break-words.text-lg.font-semibold.text-gray-999");
  // const postSnippet = document.querySelectorAll("p.pointer-events-none.line-clamp-1.whitespace-pre-wrap.break-words.text-sm/5.md:line-clamp-3");

  postDivs.forEach(postDiv => {
    const postTitle = postDiv.querySelector("h2");
    // const postSnippet = postDiv.querySelector("p");
    // console.log("### " + postTitle.textContent + "\n" + postSnippet.textContent);
    postTitle.textContent = "I AM GROOT";
    // postSnippet.textContent = "Groot is actually the coolest Guardian of the Galaxy.";
  });
}

// ADD LLM SECTION NEXT! 
// POST TITLE AND SNIPPET TEXT REPLACEMENT ARE WORKING SO FAR.

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (const mutation of mutationsList) {
    execute();
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document, config);