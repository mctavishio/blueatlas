const fs = require('fs');
const https = require('https');
const keys = require('./keys');
const words = require('./outputWords_dictionary_byText1631741974286_Retried1631751307398');
const nullwords = require('./outputWordsNullDefs1631751307390');

let nullwordsx = nullwords.map( w => { 
	let def = w.def.map(d => {
			return {
				shortdef: d.shortdef || ["nothingness"],
				fl: d.fl || "unknown"
			}
		});

	return {
		text: w.text, 
		def: def
	}
});
fs.writeFile('outputWordsNullDefsShort'+Date.now()+'.js', JSON.stringify(nullwordsx, null, "\t"), 'utf8', e => {console.log("done")});

let nulldefs = nullwordsx.filter( w => w.def.length === 0 );
fs.writeFile('outputWordsNullDefs'+Date.now()+'.js', JSON.stringify(nulldefs, null, "\t"), 'utf8', e => {console.log("done")});
nulldefs = nulldefs.map( w => {return{ text: w.text }});
console.log("nulldefs count = " + nulldefs.length);
fs.writeFile('outputWordsNullDefs_summary'+Date.now()+'.js', JSON.stringify(nulldefs, null, "\t"), 'utf8', e => {console.log("done")});

nullwordsx.forEach( nullword => {
	let word = words.filter( w => w.text === nullword.text)[0];
	word.def = nullword.def;
});

fs.writeFile('outputWords_dictionary_byText1631741974286_Retried'+Date.now()+'.js', JSON.stringify(words, null, "\t"), 'utf8', e => {console.log("done")});






