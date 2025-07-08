# discord-lirdle
lirdle.com (wordle, one lie per line) integrated as a discord.js application.

## Original by: Eric Promislow, aka. Squirrel Smith

# This project is still in beta version!
There are many unimplemented features plus possible bugs I have not seen.

# To-do List (descending priority):
1. Keep track daily words. (Idea: bot checks for the daily word and stores it in `./models/dailyWords.js`. The word will only change if the date has changed. Before it overwrites the daily word, it stores the old daily word to `./models/usedDailyWords.js`.)
2. The actual lirdle game. (Rewrite `getFeedback()` function in `./models/lirdle/model.js`.)
3. A better way to actually play the game. (I don't like having to click buttons and all. Remnants of AttachmentBuilder are present in some files because I was contemplating having to use an interactive image that looks like the game itself. **I'm looking for ideas, please suggest or submit pull request**.) 
4. Bug hunting idk.