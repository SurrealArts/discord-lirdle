// test/randomizerTest.js
import { getRandomWord } from '../models/randomizer.js';
import { WORDS, OTHERWORDS } from '../models/words.js';

const runTest = () => {
    const word = getRandomWord();

    console.log('Random word:', word);

    if (!WORDS.includes(word)) {
        console.error('❌ Word is not in WORDS list!');
        process.exit(1);
    }

    if (OTHERWORDS.includes(word)) {
        console.warn('⚠️ Word is in OTHERWORDS (should not be an answer?)');
    } else {
        console.log('✅ Word is valid and not in OTHERWORDS.');
    }
};

runTest();