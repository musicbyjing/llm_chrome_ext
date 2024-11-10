# chrome_extension

To install dependencies:

```bash
bun install
```

To run:

```bash
bun copy-static
bun dev
```

Load the generated `dist` directory into Chrome.

This project was created using `bun init` in bun v1.1.26. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# TODO
- Very occasionally, the LLM returns strange responses; doesn't respect my instructions, or adds in "Original title": {title}, or adds backticks.
  - Added new instruction to not rewrite "layoff" as "hiring spree". Might require a refresh of the cache.
- Make the MutationObserver run as you scroll down the page.

# DONE
- Add stream parser.
- Fix stream parser.
  - Display LLM text in the DOM.
- Sometimes a new load doesn't catch any postDivs (postDivsArray.length == 0).
  - Added a listener for DOMContentLoaded, but now no code is running - no fetches, LLM calls, nothing. Issue with DOMContentLoaded.
  - Learned that DOMContentLoaded for popup.html is different than for the host webpage.
  - Fixed using MutationObserver that specifically targets the postDivs, and runs processTitle() on them individually. The MutationObserver and the postDivs' for loop are now integrated, unlike before.
- Seems to be no issue with dangerouslyAllowBrowser option?
