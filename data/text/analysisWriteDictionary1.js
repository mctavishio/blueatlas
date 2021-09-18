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
const partsOfSpeech = ["noun", "verb", "adjective", "adverb", "symbol", "unknown"];

const goals = ["letterman", "tickertape", "abecedarium", "justify", "flying geese", "living stanza", "dictionary", "index"];
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
		poem = poem + `<dt>${word.text}</dt><dd><span class="books">in books ::: ${books.map(b => b.book).join(", ")}</span><br/>`
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
fs.writeFile('outputDictionary' + Date.now() + '.html', `
<html>
	<style>
	:root {
	  --red: #9a0000;
	  --yellow: #ffcc00;
	  --black: #000000;
	  --warmblack: #191918;
	  --warmgray: #4b4b44;
	  --warmlightgray: #656560;
	}
	html {
	    border-left: solid 1em #9a0000;
	    border-right: dashed 1rem #191918;
	    border-left: solid 1em var(--red);
	    border-right: dashed 1rem var(--warmblack);
	    padding:2rem;
	}
	body {
	  color: var(--warmblack);
	  background: var(--warmwhite);
	  font-family:courier;
	  font-size: clamp(0.9rem, 2vw, 2rem);
	  line-height: 1.8em; 
	}
	p {
	  text-align: justify;
	  text-align-last: justify;
	  text-justify: inter-word;
	  width: clamp(50ch, 55ch, 100%);
	}
	hr {
	  border-bottom: solid 4px var(--warmgray);
	}
	a {
	  font-weight:bold;
	  text-decoration: none;
	  color: #fcfbe3;
	  color: var(--warmwhite);
	}
	a:before {
	  color: #fcfbe3;
	  color: var(--warmwhite);
	  font-weight:bolder;
	  content: ":> ";
	}
	dt {
		color: var(--red);
		font-weight: bold;
	}
	dd {
		font-size: 0.8em;
	}
	span.books {
		color: var(--warmlightgray);
		font-style: italic;
	}
	span.fl {
		color: var(--warmblack);
		font-style: italic;
		font-weight: bold;
	}
	a:hover, a:focus {
	  color: var(--warmwhite);
	  text-decoration: underline solid 2px var(--red);
	  outline: solid 4px var(--warmblack);
	  outline-offset: 0.5em;
	}
	</style>
	<body>
		<h1>dictionary :::</h1>
		<h2>all texts</h2>
		<p><i>word collection .| . . . |. nets</i></p>
		<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>
		<hr/>
		${poem}
		<hr/>
		<p>words puuled from ${books.join(" || ")}</p>
		<p>generated on ::  ${new Date().toISOString()}</p>
		<hr/><hr/>
		</body></html>`, 'utf8', e => {console.log("done")});
