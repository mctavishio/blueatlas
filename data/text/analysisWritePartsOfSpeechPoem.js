const fs = require('fs');
const https = require('https');
const keys = require('./keys');

const words = require('./wordsAllForPoems_withDictionary');
const books = ["birdland","blueWindow","artist","fieldNotes"];
const booktitles = ["birdland", "night train blue window", "artist self", "blue atlas ::: field notes"];
// const books = [,"artist"];
const nstanzas = 8;
const nstanzalines = 18;
const linelength = 48;
const nstanzachars = nstanzalines*nstanzas;

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

let wordsx = words.reduce( (acc, word, index) => {
	[...Array(word.count).keys()].map( j => {
		// acc[index] = {n:word.n, count:word.count,text:word.text};
		let v = vowels.reduce( (thisvows, v, index) => {
			let re = new RegExp(v, "g");
			let l = (word.text.match(re)||[]).length;
			thisvows[0][v] = l; thisvows[1] = thisvows[1] + l;
			return thisvows;
		}, [{},0]);
		acc = [...acc, {n:word.n, count:word.count, text:word.text, vowels: v[0], nvowels: v[1] }];
	});
	return acc;
}, []);


books.forEach( (book,j) => {
	let booktitle = booktitles[j];
	let wordsBook = words.filter( word => { 
		return word.books.filter( b => b.book===book ).length > 0
	});

	let wordsx = wordsBook.reduce( (acc, word, index) => {
		let count = word.books.filter( b => b.book===book )[0].count;
		[...Array(count).keys()].map( j => {
			acc = [...acc, {n:word.n, count:count, text:word.text, vowels: words.vowels, nvowels: word.nvowels, def: word.def }];
		});
		return acc;
	}, []);
	let sum=0;
	while(sum < nstanzachars) {
				let entry = linelength-sum===3 ? 2 : randominteger(1,Math.min(maxchars,linelength-sum));
				stick.push(entry);
				sum = sum + entry + 1;
	}



	let maxchars = Math.max(...wordsBook.map(w => w.n));
	let poem = "";
	[...Array(nstanzas).keys()].forEach( s => {
		const brokenStick = [...Array(nstanzalines).keys()].reduce( (acc, word, index) => {
			let stick = [], sum=0;
			while(sum < linelength) {
				let entry = linelength-sum===3 ? 2 : randominteger(1,Math.min(maxchars,linelength-sum));
				stick.push(entry);
				sum = sum + entry + 1;
			}
			console.log("stick = " + stick.join(' '));
			console.log("linelength = " + sum);
			shufflearray(stick);
			let lines = stick.map( n => { 
				let wordchoices = wordsx.filter( w => { return (w.n === n) } );
				if(wordchoices.length === 0) {
					wordchoices = wordsx.filter( w => { return (w.n === n-1) } );
				}
				return wordchoices.length === 0 ? [...Array(n).keys()].join('') : wordchoices[randominteger(0,wordchoices.length)].text;
			});
			console.log("actual line = " + lines.join(' '));
			console.log("actual linelength = " + lines.join(' ').length);
			return {sticks: [...acc.sticks,stick], lines: [...acc.lines,lines]};
		}, {sticks: [], lines: []});

		let stanza = brokenStick.lines.reduce( (acc, line, j) => {
			// return acc + line.reduce( (str, word) => { return str + " " + word;}, "") + "**<br/>";
			return acc + line.join(" ") + "<br/>";
		}, "");
		poem = poem + "<p>"+stanza+"</p><hr/>";

	});
	fs.writeFile('outputJustifyPoem_' + book + '_' + Date.now() + '.html', `
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
			<h1>justify :::</h1>
			<h2>${booktitle}</h2>
			<p><i>probability .| . . . |. hash</i></p>
			<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>

			${poem}
			<hr/>
			<p>excerpts from ${booktitle}</p>
			<p>generated on ::  ${new Date().toISOString()}</p>
			<hr/><hr/>
			</body></html>`, 'utf8', e => {console.log("done")});
});

books.forEach( (book,j) => {
	let booktitle = booktitles[j];
	let wordsBook = words.filter( word => { 
		return word.books.filter( b => b.book===book ).length > 0
	});

	let wordsx = wordsBook.reduce( (acc, word, index) => {
		let count = word.books.filter( b => b.book===book )[0].count;
		[...Array(count).keys()].map( j => {
			acc = [...acc, {n:word.n, count:count, text:word.text, vowels: words.vowels, nvowels: word.nvowels }];
		});
		return acc;
	}, []);
	let maxchars = Math.max(...wordsBook.map(w => w.n));
	let poem = "";
	[...Array(nstanzas).keys()].forEach( s => {
		const brokenStick = [...Array(nstanzalines).keys()].reduce( (acc, word, index) => {
			let stick = [], sum=0;
			while(sum < linelength) {
				let entry = linelength-sum===3 ? 2 : randominteger(1,Math.min(maxchars,linelength-sum));
				stick.push(entry);
				sum = sum + entry + 1;
			}
			console.log("stick = " + stick.join(' '));
			console.log("linelength = " + sum);
			shufflearray(stick);
			let lines = stick.map( n => { 
				let wordchoices = wordsx.filter( w => { return (w.n === n) } );
				if(wordchoices.length === 0) {
					wordchoices = wordsx.filter( w => { return (w.n === n-1) } );
				}
				return wordchoices.length === 0 ? [...Array(n).keys()].join('') : wordchoices[randominteger(0,wordchoices.length)].text;
			});
			console.log("actual line = " + lines.join(' '));
			console.log("actual linelength = " + lines.join(' ').length);
			return {sticks: [...acc.sticks,stick], lines: [...acc.lines,lines]};
		}, {sticks: [], lines: []});

		let stanza = brokenStick.lines.reduce( (acc, line, j) => {
			// return acc + line.reduce( (str, word) => { return str + " " + word;}, "") + "**<br/>";
			return acc + line.join(" ") + "<br/>";
		}, "");
		poem = poem + "<p>"+stanza+"</p><hr/>";

	});
	fs.writeFile('outputPartsOfSpeecPoem_' + book + '_' + Date.now() + '.html', `
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
			<h1>parts of speech :::</h1>
			<h2>${booktitle}</h2>
			<p><i>probability .| . . . |. hash</i></p>
			<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>

			${poem}
			<hr/>
			<p>excerpts from ${booktitle}</p>
			<p>generated on ::  ${new Date().toISOString()}</p>
			<hr/><hr/>
			</body></html>`, 'utf8', e => {console.log("done")});
});





