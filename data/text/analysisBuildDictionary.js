const fs = require('fs');
const https = require('https');
const keys = require('./keys');
// const words = require('./wordsArtistSelf');
// const words = require('./wordsFieldNotes');
// const words = require('./wordsBlueWindow');
const words = require('./wordsBirdland');

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
	let v = vowels.reduce( (thisvows, v, index) => {
		let re = new RegExp(v, "g");
		let l = (word.text.match(re)||[]).length;
		thisvows[0][v] = l; thisvows[1] = thisvows[1] + l;
		return thisvows;
	}, [{},0]);
	acc = [...acc, {n:word.n, count:word.count, text:word.text, vowels: v[0], nvowels: v[1] }];

	return acc;
}, []);

//https://www.npmjs.com/package/node-fetch
// function getDefinition(word) {
//   fetch(`http://www.dictionaryapi.com/api/v1/references/collegiate/xml/${word}?key=${keys.dictionary}`)
//     .then(response => response.text())
//     .then(data => console.log(JSON.stringify(data)))
//     .catch(error => console.error(error));
// }
// const request = require('request-promise');
// const urls = ["http://www.google.com", "http://www.example.com"];
// const promises = urls.map(url => request(url));
// Promise.all(promises).then((data) => {
//     // data = [promise1,promise2]
// });
// getDefinition('test'); 
wordsx.sort( (worda,wordb) => worda.text < wordb.text );
//https://www.dictionaryapi.com/products/api-collegiate-dictionary.htm


//https://www.dictionaryapi.com/products/api-collegiate-dictionary

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
						word: word.text,
						shortdef: e.shortdef,
						fl: e.fl
					}
				});
				word.def.push(...entry);
				console.log("done :: " + word.text);
				console.log("completed_requests :: " + completed_requests + " wordsx.length :: " + testn);
				// fs.writeFile('dictionaryTest/'+ word.text +'.js', JSON.stringify(entry,null,"\t"), 'utf8', e => {console.log("done :: " + word.text)});

		  	// if (completed_requests === wordsx.length - 1) {
		  	if (!(completed_requests < testn - 1)) {
		  		console.log("true");
		  		fs.writeFile('analysisOutputWordsExt_dictionary'+Date.now()+'.js', JSON.stringify(wordsx, null, "\t"), 'utf8', e => {console.log("done")});
		  	}
		  } catch(e) { "oops " + word.text + " " + e}
		});
	});
	// }
	console.log(word.def);
})