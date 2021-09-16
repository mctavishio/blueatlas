const fs = require('fs');
const https = require('https');
const keys = require('./keys');
const artist = require('./wordsArtistSelf');
const fieldnotes = require('./wordsFieldNotes');
const bluewindow = require('./wordsBlueWindow');
const birdland = require('./wordsBirdland');

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

let words = artist.map( word => {
	return { n: word.n, count: word.count, text: word.text, books: [ {book: "artist", count: word.count} ] }
});

birdland.forEach( word => {
		let entry = words.filter(w => w.text === word.text);
		if(entry.length===0) {
			words.push({ n: word.n, count: word.count, text: word.text, books: [ {book: "birdland", count: word.count} ] });
		}
		else {
			entry[0].count = entry[0].count + word.count; entry[0].books.push({book: "birdland", count: word.count});
		}
});

bluewindow.forEach( word => {
		let entry = words.filter(w => w.text === word.text);
		if(entry.length===0) {
			words.push({ n: word.n, count: word.count, text: word.text, books: [ {book: "blueWindow", count: word.count} ] });
		}
		else {
			entry[0].count = entry[0].count + word.count; entry[0].books.push({book: "blueWindow", count: word.count});
		}
});

fieldnotes.forEach( word => {
		let entry = words.filter(w => w.text === word.text);
		if(entry.length===0) {
			words.push({ n: word.n, count: word.count, text: word.text, books: [ {book: "fieldNotes", count: word.count} ] });
		}
		else {
			entry[0].count = entry[0].count + word.count; entry[0].books.push({book: "fieldNotes", count: word.count});
		}
});

let wordsx = words.reduce( (acc, word, index) => {
	let v = vowels.reduce( (thisvows, v, index) => {
		let re = new RegExp(v, "g");
		let l = (word.text.match(re)||[]).length;
		thisvows[0][v] = l; thisvows[1] = thisvows[1] + l;
		return thisvows;
	}, [{},0]);
	acc = [...acc, {n:word.n, count:word.count, text:word.text, books:word.books, vowels: v[0], nvowels: v[1] }];
	return acc;
}, []);

wordsx.sort( (worda,wordb) => worda.text < wordb.text );
//https://www.dictionaryapi.com/products/api-collegiate-dictionary.htm

fs.writeFile('vocabulary'+Date.now()+'.js', JSON.stringify(wordsx, null, "\t"), 'utf8', e => {console.log("done vocabulary file")});

let completed_requests = 0;
let dictionary = {};
let testn = wordsx.filter(w => w.nvowels>0).length;
wordsx.forEach( word => {
	let url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word.text}?key=${keys.dictionary}`;
	word.def = [];
	
	// if(word.nvowels>0) {
	https.get(url, res => {
		let responses = [];
		res.on('data', chunk => {
			responses.push(chunk);
		});
		// res.on('error', err => {
		// 	++completed_requests;
		// });

		res.on('end', () => {
			++completed_requests;
			try {
				let entry = ( JSON.parse(responses.join()) ).filter(e =>  e.hwi.hw.indexOf(' ') === -1 ).map( e => {
				// let entry = ( JSON.parse(responses.join()) ).map( e => {
					return {
						shortdef: e.shortdef,
						fl: e.fl
					}
				});
				word.def.push(...entry);
				console.log("done :: " + word.text);
				console.log("completed_requests :: " + completed_requests + " wordsx.length :: " + testn);
				// fs.writeFile('dictionaryTest/'+ word.text +'.js', JSON.stringify(entry,null,"\t"), 'utf8', e => {console.log("done :: " + word.text)});

		  	if (completed_requests === wordsx.length - 1) {
		  	// if (!(completed_requests < testn - 1)) {
		  		console.log("true");
		  		fs.writeFile('outputWords_dictionary'+Date.now()+'.js', JSON.stringify(wordsx, null, "\t"), 'utf8', e => {console.log("done")});
		  	}
		  } catch(e) { "oops " + word.text + " " + e}
		});

	});
	// }
	console.log(word.def);
})