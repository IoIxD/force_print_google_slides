## force_print_google_slides

# This is an over-engineered solution because I didn't think Google, the same ones who made the slowest document viewer I've ever used, were capable of making a simple program. But alas, Google Slides actually has a very simple structure and [there is a much better, faster solution to this](https://stackoverflow.com/questions/31662455/how-to-download-google-slides-as-images)

People giving out Google Slides are allowed to place it in this weird state where you can only view it as a presentation, and you are not allowed to print it or do anything other then view it in big picture mode. What people who do this fail to recognize is that you can *just screenshot the slides and then print them manually, making this a worthless feature*.

## Original README

This program makes it even more worthless by doing this automatically for you; it screenshots all the unique slides in a Google Slides and puts them into a pdf.

# Usage

A proper usage paragraph on those who has never used [Node.js, NPM,](https://nodejs.org/en/download/) or the terminal is coming soon.

For those that have...
- Clone the repository and cd to it.
- Create a "slides.yml" file in populate with the URLs to the slides you want to print in the following format:
```
slides:
- https://docs.google.com/presentation/d/e/2PAC...
- https://docs.google.com/presentation/d/e/2PAC...
```
- Run `npm install` in the directory and make sure to run `npm install -D ts-node`. 
- Run `ts-node ./src/index.ts`
