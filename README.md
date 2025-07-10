# discord-lirdle
lirdle.com (wordle, one lie per line) integrated as a discord.js application.
Original by: Eric Promislow, aka. Squirrel Smith

This project might scale for more wordle variations. Snipe? No.

### This project is still in beta version!
There are many unimplemented features plus possible bugs I have not seen.

### To-do List (descending priority):
1. The actual lirdle game. (Rewrite `getFeedback()` function in `./models/lirdle/model.js`.)
2. Regroup some repetitive stuff into `./utils/`, like `embedBuilder`, `formatGuess`, `timestamp`, `validateWord`, and `fileUtils`. 
3. A better way to actually play the game. (I don't like having to click buttons and all. Remnants of AttachmentBuilder are present in some files because I was contemplating having to use an interactive image that looks like the game itself. **I'm looking for ideas, please suggest or submit pull request**.) 
4. Bug hunting idk.