const fs = require('fs');
const https = require('https');
const keys = require('./keys');
const words = require('./outputWordsNullDefs1631751307390');

const randominteger = (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
};

let completed_requests = 0;
let dictionary = {};
// let wordsx = words.filter( w => w.nvowels>0);
let wordsx = words;
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
				let entry = ( JSON.parse(responses.join()) ).map( e => {
					return e;
					// return {
					// 	shortdef: e.shortdef,
					// 	fl: e.fl
					// }
				});
				word.def.push(...entry);
				console.log("done :: " + word.text);
				console.log("completed_requests :: " + completed_requests + " wordsx.length :: " + wordsx.length);
				// fs.writeFile('dictionaryTest/'+ word.text +'.js', JSON.stringify(entry,null,"\t"), 'utf8', e => {console.log("done :: " + word.text)});

		  	if (completed_requests === wordsx.length - 1) {
		  	// if (!(completed_requests < testn - 1)) {
		  		console.log("true");
		  		fs.writeFile('outputWordsNull_dictionary'+Date.now()+'.js', JSON.stringify(wordsx, null, "\t"), 'utf8', e => {console.log("done")});
		  	}
		  } catch(e) { "oops " + word.text + " " + e}
		});

	});
})