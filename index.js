const fs = require('fs');
const path = require('path');
const processTime = require('perf_hooks').processTime;

function isCompound(word, wordSet) {
    if (!word) return false;
    const n = word.length;


    const dp = Array(n + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(word.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[n];
}

function findLongestCompoundWords(filePaths) {
    const startTime = processTime.now();

   
    const allWords = new Set();
    filePaths.forEach((filePath) => {
        const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
        const words = content.split(/\r?\n/).filter(Boolean); 
        words.forEach((word) => allWords.add(word));
    });

   
    const wordList = Array.from(allWords);
    wordList.sort((a, b) => b.length - a.length); 

    const wordSet = new Set(wordList);
    let longestCompoundWord = '';
    let secondLongestCompoundWord = '';

    for (const word of wordList) {
        wordSet.delete(word); 
        if (isCompound(word, wordSet)) {
            if (!longestCompoundWord) {
                longestCompoundWord = word;
            } else if (!secondLongestCompoundWord) {
                secondLongestCompoundWord = word;
                break;
            }
        }
        wordSet.add(word); 
    }

    const endTime = processTime.now();
    const timeTaken = (endTime - startTime).toFixed(2);

    console.log(`Longest compounded word: ${longestCompoundWord}`);
    console.log(`Second longest compounded word: ${secondLongestCompoundWord}`);
    console.log(`Time taken: ${timeTaken}ms`);

    const outputContent = `
Longest compounded word: ${longestCompoundWord}
Second longest compounded word: ${secondLongestCompoundWord}
Time taken: ${timeTaken}ms
    `;
    fs.writeFileSync('output.txt', outputContent.trim(), 'utf-8');

    return { longestCompoundWord, secondLongestCompoundWord, timeTaken };
}

const files = ['Input_02.txt'];
findLongestCompoundWords(files);
