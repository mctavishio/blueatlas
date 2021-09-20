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

const goals = ["letterman", "tickertape", "abecedarium", "justify", "flying geese", "living stanza", "dictionary", "index"];
const randominteger = (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
};
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');
let symbols = '.|:+-.&~_|::=<>:#x=&&^'.split('');


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
books.forEach( (book,j) => {
	let booktitle = booktitles[j];
	let wordsBook = words.filter( word => { 
		return word.books.filter( b => b.book===book ).length > 0
	});

	let wordsx = words;
	// let wordsx = wordsBook.reduce( (acc, word, index) => {
	// 	let count = Math.max(word.books.filter( b => b.book===book )[0].count, maxcount) ;
	// 	[...Array(count).keys()].map( j => {
	// 		acc = [...acc, {n:word.n, count:count, text:word.text, vowels: word.vowels, nvowels: word.nvowels }];
	// 	});
	// 	return acc;
	// }, []);
	let poem = "";
	[...Array(nstanzas).keys()].forEach( s => {

		vowels.map( vowel => {
			let wvow = wordsx.filter( word => { return word.vowels[vowel]>0 && word.nvowels===word.vowels[vowel]}).map(w => w.text);

			let stanza = "";
			while(stanza.length < nstanzachars) {
					stanza = stanza + wvow[randominteger(0,wvow.length)] + " ";
					if(randominteger(0,10) < 2) {
						[...Array(randominteger(1,4)).keys()].forEach( j => { stanza = stanza + symbols[randominteger(0,symbols.length)]} )
						stanza = stanza + " ";
					}
			}
			poem = poem + "<p>" + stanza + "</p><hr/>";
		});
	});
		// fs.writeFile('outputVowelsPoem_' + book + '_' + vowel + '_'+ Date.now() + '.html', `
		fs.writeFile('outputVowelsPoem2_' + book + '_' + rawdatestr + '.html', `
		<html>
			<link rel="stylesheet" href="analysis.css"/>
			<body>
				<h1>vowel poems :::</h1>
				<h2>${booktitle}</h2>
				<p><i>abecedarium  .| . . . |. hash</i></p>
				<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>
				<hr/>
				${poem}
				<hr/>
				<dl>
				<dt>from book ::: </dt><dd> ${booktitle}</dd>
				<dt>generated on ::: </dt><dd>  ${datestr}</dd>
				</dl>
				<hr/><hr/>
				</body></html>`, 'utf8', e => {console.log("done")});
	});