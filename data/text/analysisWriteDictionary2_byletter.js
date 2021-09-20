const fs = require('fs');
const https = require('https');
const keys = require('./keys');

const words = require('./wordsAllPoems_withDictionary');
const books = ["birdland","blueWindow","artist","fieldNotes"];
const booktitles = ["birdland", "night train blue window", "artist self", "blue atlas ::: field notes"];
// const books = [,"artist"];
const nstanzas = 8;
const nstanzalines = 4;
const linelength = 48;
const nstanzachars = nstanzalines*linelength;

const now = new Date();
const rawdatestr = now.getTime();
const datestr = now.toISOString();

const randominteger = (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
};
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');
let symbols = '.|:+-.&~_|::=<>:#x=&&∴'.split('');

//Fisher-Yates (aka Knuth) Shuffle
const shufflearray = array => {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

const maxcount = 40;
let wordsx = words;
// let wordsx = words.reduce( (acc, word, index) => {
// 	let count = Math.max(word.count, maxcount*2);
// 	[...Array(count).keys()].map( j => {
// 		acc = [...acc, {n:word.n, count:count, text:word.text, vowels: word.vowels, nvowels: word.nvowels }];
// 	});
// 	return acc;
// }, []);
let poem = "<dl>";
words.map(word => {
	if(word.nvowels !== 0) {
		let books = word.books || [ {book: "all", books: d.books}];
		let bookstr = books.map(b =>  { return b.book +" (" + b.count +")"}).join(", ");
		poem = poem + `<dt>${word.text} (${word.count})</dt><dd><span class="books">in books ::: ${bookstr}</span><br/>`
		word.def.map( d => {
			// if(d.shortdef[0] !== ".||.") {
				let shortdef = d.shortdef || [". . ."];
				poem = poem + `<span class="fl">(${d.fl})</span> ${shortdef.join(", ")}<br/>`
			// }
		})
		poem = poem + ` </dd>`;
	}
});
poem = poem + "</dl>";
// fs.writeFile('outputVowelsPoem_' + book + '_' + vowel + '_'+ Date.now() + '.html', `
console.log(datestr);
fs.writeFile('outputDictionary' + '_' +rawdatestr + '.html', `
<html>
	<link rel="stylesheet" href="analysis.css"/>
	<body>
		<h1>dictionary :::</h1>
		<h2>all texts</h2>
		<p><i>word collection .| . . . |. nets</i></p>
		<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>
		<hr/>
		${poem}
		<hr/>
		<dl>
		<dt>words pulled from books ::: </dt><dd> ${books.join(" || ")}</dd>
		<dt>generated on ::: </dt><dd>  ${datestr}</dd>
		</dl>
		<hr/><hr/>
		</body></html>`, 'utf8', e => {console.log("done")});
