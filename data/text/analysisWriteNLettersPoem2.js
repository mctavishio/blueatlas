const fs = require('fs');
const https = require('https');
const keys = require('./keys');
// const books = ["birdland","blueWindow","artist","fieldNotes"];
// const booktitles = ["birdland", "night train blue window", "artist self", "blue atlas ::: field notes"];
const books = ["birdland","blueWindow","fieldNotes"];
const booktitles = ["birdland", "night train blue window","blue atlas ::: field notes"];
// const books = [,"artist"];
const words = require('./wordsAllPoems_withDictionary').filter( word=> {
	let isIn = false;
	books.forEach( b => {
		word.books.forEach(wb=>{
			if(wb.book === b) isIn=true;
		})
	});
	return isIn;
});
const nstanzas = 4;
const nstanzalines = 8;
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

// let wordsx = words.reduce( (acc, word, index) => {
// 	let count = Math.max(word.count, maxcount*2);
// 	[...Array(count).keys()].map( j => {
// 		acc = [...acc, {n:word.n, count:count, text:word.text, vowels: word.vowels, nvowels: word.nvowels }];
// 	});
// 	return acc;
// }, []);
let poem = "";
let maxn = words.reduce( (acc, word, index) => {
	return word.n > acc ?  word.n : acc;
}, 0);

[...Array(maxn-1).keys()].map(k=>k+1).forEach( n => {
	poem = poem + `<p>-- # <span class="red bold">${n}</span> :|.| =>  <= ...</p><hr/>`
	let wordsx = words.filter(word => word.n ===  n).map(w => w.text);
	wordsx.sort();
	[...Array(nstanzas).keys()].forEach( ( s, count ) => {
		
		let stanza = `<p>.${symbols[randominteger(0,symbols.length)]}${symbols[randominteger(0,symbols.length)]}${symbols[randominteger(0,symbols.length)]}...</p><p>`;
		while(stanza.length < nstanzachars) {
				stanza = stanza + wordsx[randominteger(0,wordsx.length)] + " ";
				if(randominteger(0,10) < n-2) {
					[...Array(randominteger(1,4)).keys()].forEach( j => { stanza = stanza + symbols[randominteger(0,symbols.length)]} )
					stanza = stanza + " ";
				}
		}
		poem = poem + stanza + "</p>";
	// });
	});
	poem = poem + "<hr/>";
});
// fs.writeFile('outputVowelsPoem_' + book + '_' + vowel + '_'+ Date.now() + '.html', `
fs.writeFile('outputNLettersPoem1_allbooks' + '_' + rawdatestr + '.html', `
<html>
	<link rel="stylesheet" href="analysis.css"/>
	<body>
		<h1># letters ::: (1 => ${maxn-1})</h1>
		<p><i>letter +.+ count .| . . . |. hash</i></p>
		<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>
		<hr/>
		${poem}
		<hr/>
			<dl>
			<dt>from ::: </dt><dd>  ${books.join(" || ")}</dd>
			<dt>generated on ::: </dt><dd>  ${datestr}</dd>
			</dl>			<hr/><hr/>
		</body></html>`, 'utf8', e => {console.log("done")});
