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

# TODO:

- Add stream parser. getNewTitle() returns a ReadableStream, which must be parsed before being displayed in the DOM. It can be displayed dynamically (while streaming), or we can wait until the stream is finished before displaying the text.
- Include the other post titles. We're only executing for the first 2 titles.