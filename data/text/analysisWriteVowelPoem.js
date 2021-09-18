const fs = require('fs');
const https = require('https');
const keys = require('./keys');

const words = require('./wordsAllPoems_withDictionary');
const books = ["birdland","blueWindow","artist","fieldNotes"];
const booktitles = ["birdland", "night train blue window", "artist self", "blue atlas ::: field notes"];
// const books = [,"artist"];
const nstanzas = 8;
const nstanzalines = 18;
const linelength = 48;
const nstanzachars = nstanzalines*linelength;
const partsOfSpeech = ["noun", "verb", "adjective", "adverb", "symbol", "unknown"];

const goals = ["letterman", "tickertape", "abecedarium", "justify", "flying geese", "living stanza", "dictionary", "index"];
const randominteger = (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
};
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');

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

	let wordsx = wordsBook.reduce( (acc, word, index) => {
		let count = Math.max(word.books.filter( b => b.book===book )[0].count, maxcount) ;
		[...Array(count).keys()].map( j => {
			acc = [...acc, {n:word.n, count:count, text:word.text, vowels: word.vowels, nvowels: word.nvowels }];
		});
		return acc;
	}, []);

	vowels.map( vowel => {
		let wvow = wordsx.filter( word => { return word.vowels[vowel]>0 && word.nvowels===word.vowels[vowel]}).map(w => w.text);

		let poem = "";
		[...Array(nstanzas).keys()].forEach( s => {
			let stanza = "";
			while(stanza.length < nstanzachars) {
					stanza = stanza + wvow[randominteger(0,wvow.length)] + " ";
			}
			poem = poem + "<p>" + stanza + "</p><hr/>";
		});
		fs.writeFile('outputVowelsPoem_' + book + '_' + vowel + '_'+ Date.now() + '.html', `
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
			a:hover, a:focus {
			  color: var(--warmwhite);
			  text-decoration: underline solid 2px var(--red);
			  outline: solid 4px var(--warmblack);
			  outline-offset: 0.5em;
			}
			</style>
			<body>
				<h1>vowel poems :::</h1>
				<h2>${booktitle}</h2>
				<p><i>::: featuring the letter ::: ${vowel}</i></p>
				<p><i>probability .| . . . |. hash</i></p>
				<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>

				${poem}
				<hr/>
				<p>excerpts from ${booktitle}</p>
				<p>generated on ::  ${new Date().toISOString()}</p>
				<hr/><hr/>
				</body></html>`, 'utf8', e => {console.log("done")});

	});
});
