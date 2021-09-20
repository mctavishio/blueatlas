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
const nstanzachars = nstanzalines*nstanzas;


const now = new Date();
const rawdatestr = now.getTime();
const datestr = now.toISOString();

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

books.forEach( (book,j) => {
	let booktitle = booktitles[j];
	let wordsBook = words.filter( word => { 
		return word.books.filter( b => b.book===book ).length > 0
	});

	// let wordsx = words;
	let wordsx = wordsBook.reduce( (acc, word, index) => {
		let count = word.books.filter( b => b.book===book )[0].count;
		[...Array(count).keys()].map( j => {
			acc = [...acc, {n:word.n, count:count, text:word.text, vowels: word.vowels, nvowels: word.nvowels }];
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
	fs.writeFile('outputJustifyPoem_' + book + '_' + rawdatestr + '.html', `
	<html>
		<link rel="stylesheet" href="analysis.css"/>
		<body>
			<h1>justify :::</h1>
			<h2>${booktitle}</h2>
			<p><i>probability .| . . . |. hash</i></p>
			<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>
			${poem}
			<hr/>
				<dl>
				<dt>from book ::: </dt><dd> ${booktitle}</dd>
				<dt>generated on ::: </dt><dd>  ${datestr}</dd>
				</dl>
			<hr/><hr/>
			</body></html>`, 'utf8', e => {console.log("done")});
});
