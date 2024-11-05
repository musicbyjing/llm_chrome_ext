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
- Sometimes a new load doesn't catch any postDivs (postDivsArray.length == 0).
  - Added a listener for DOMContentLoaded, but now no code is running - no fetches, LLM calls, nothing. Issue with DOMContentLoaded.
- Sometimes the LLM returns strange responses; doesn't respect my instructions.
- Include the other post titles. We're only executing for the first 2 titles.

# DONE
- Add stream parser.
- Fix stream parser.
  - Display LLM text in the DOM.

