# `five-minute-journal`

```js
npm i five-minute-journal -g
```

## Why?

I'm a developer and I'm always in terminal anyway, love the interface for note taking. Plus now I already have my data digitized and I don't need to do any notebook transcribing!

### How?

[![asciicast](https://asciinema.org/a/dcktwrn7dbigxm56tsvvwntie.png)](https://asciinema.org/a/dcktwrn7dbigxm56tsvvwntie)

The journal should be filled out in two chunks, in the morning and at night. So I wrote it so that if the file does not exist for that day it will prompt you with the day questions, and if it does it will prompt you with the night questions.

Generates a file `2017-01-22-five-minute-journal.json` in the current working directory.

```json
{
  "I am grateful for...": [
    "My health",
    "My family",
    "My friendships"
  ],
  "What would make today great?": [
    "Spreading love and peace",
    "Learning something new",
    "Rediscovering an old memory"
  ],
  "3 Amazing things that happened today...": [
    "Went to red hook / software for art day",
    "Learned a ton of art / tech stuff",
    "Met a whole bunch of people!"
  ],
  "How could I have made today even better?": [
    "Met more people / Work on side projects"
  ]
}
```
