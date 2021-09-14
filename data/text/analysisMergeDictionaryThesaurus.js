const fs = require('fs');
const https = require('https');
const keys = require('./keys');
// const dictionary = require('./wordsFieldNotes_withDictionary');
// const dictionary = require('./wordsArtistSelf_withDictionary');
// const dictionary = require('./wordsBlueWindow_withDictionary');
const dictionary = require('./wordsBirdland_withDictionary');
// const thesaurus = require('./wordsFieldNotes_withThesaurus');
// const thesaurus = require('./wordsArtistSelf_withThesaurus');
// const thesaurus = require('./wordsBlueWindow_withThesaurus');
const thesaurus = require('./wordsBirdland_withThesaurus');

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

dictionary.map( word => {
	let tword = thesaurus.filter( tw => tw.text === word.text )[0] || {def:[]};
	word.syns = tword.def.reduce( (acc, d, index) => {
				let syns = d.syns || [];
				acc = [...acc, ...syns];
				return acc;
	}, []);
	word.ants = tword.def.reduce( (acc, d, index) => {
			let ants = d.ants || [];
			acc = [...acc, ...ants];
			return acc;
	}, []);
	console.log("merged ::: " + word.text);
	return word;
});

dictionary.sort( (worda,wordb) => worda.text < wordb.text );
fs.writeFile('analysisOutputMerge'+Date.now()+'.js', JSON.stringify(dictionary, null, "\t"), 'utf8', e => {console.log("done")});
