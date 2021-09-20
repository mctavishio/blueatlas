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
// const partsOfSpeech = ["noun", "verb", "adjective", "adverb", "symbol"];
const partsOfSpeech = ["noun", "symbol"];

const now = new Date();
const rawdatestr = now.getTime();
const datestr = now.toISOString();

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

	let wordsx = wordsBook.reduce( (acc, word, index) => {
		let count = word.books.filter( b => b.book===book )[0].count;
		[...Array(count).keys()].map( j => {
			acc = [...acc, {n:word.n, count:count, text:word.text, vowels: word.vowels, nvowels: word.nvowels, def: word.def }];
		});
		return acc;
	}, []);

	partsOfSpeech.map(pos => {
		let wpos = wordsx.filter( w => {
			return w.def.filter(d => d.fl===pos).length > 0
		}).map(w => w.text);
		console.log("book = " + book + " pos = " + pos + " npos = " + wpos.length);
		let poem = "";
		[...Array(nstanzas).keys()].forEach( s => {
			let stanza = "";
			while(stanza.length < nstanzachars) {
					stanza = stanza + wpos[randominteger(0,wpos.length)] + " ";
			}
			poem = poem + "<p>" + stanza + "</p><hr/>";
		});
		// let font = pos === "symbol" ? "monospace_zeroslash" : "monospace_zerodot";
		let font = pos === "symbol" ? "monospace_zerodot" : "monospace_code";
		fs.writeFile('outputPartsOfSpeechPoem_' + book + '_' + pos + '_'+ rawdatestr + '.html', `
			<html>
				<link rel="stylesheet" href="analysis.css"/>
				<body>
					<h1>parts of speech :::</h1>
					<h2>${booktitle} :::  ${pos}</h2>
					<p><i>probability .| . . . |. hash</i></p>
					<p><a href = "/analysis.html">[] . +.+ => <= go back</a></p>
					<div class="${font}">
					${poem}
					</div>
					<hr/>
					<dl>
					<dt>from book ::: </dt><dd> ${booktitle}</dd>
					<dt>generated on ::: </dt><dd>  ${datestr}</dd>
					</dl>
					<hr/><hr/>
					</body></html>`, 'utf8', e => {console.log("done")});
		});
});
