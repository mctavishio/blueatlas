const fs = require('fs');
const https = require('https');
const keys = require('./keys');
const words = require('./wordsAll_withDictionary');

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

// let nulldefs = words.filter( w => w.def.length === 0 );
// fs.writeFile('outputWordsNullDefs'+Date.now()+'.js', JSON.stringify(nulldefs, null, "\t"), 'utf8', e => {console.log("done")});
// nulldefs = nulldefs.map( w => {return{ text: w.text }});
// console.log("nulldefs count = " + nulldefs.length);
// fs.writeFile('outputWordsNullDefs_summary'+Date.now()+'.js', JSON.stringify(nulldefs, null, "\t"), 'utf8', e => {console.log("done")});

let poemSymbols = [
	{n: 1, count:48, text:"&", books: [ { "book": "artist", "count": 12 },{ "book": "birdland", "count": 12 },{ "book": "blueWindow", "count": 12 },{ "book": "fieldNotes", "count": 12 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:32, text:"_", books: [ { "book": "artist", "count": 8 },{ "book": "birdland", "count": 8 },{ "book": "blueWindow", "count": 8 },{ "book": "fieldNotes", "count": 8 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:32, text:"^", books: [ { "book": "artist", "count": 8 },{ "book": "birdland", "count": 8 },{ "book": "blueWindow", "count": 8 },{ "book": "fieldNotes", "count": 8 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:48, text:"0", books: [ { "book": "artist", "count": 12 },{ "book": "birdland", "count": 12 },{ "book": "blueWindow", "count": 12 },{ "book": "fieldNotes", "count": 12 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:32, text:"#", books: [ { "book": "artist", "count": 8 },{ "book": "birdland", "count": 8 },{ "book": "blueWindow", "count": 8 },{ "book": "fieldNotes", "count": 8 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:32, text:">", books: [ { "book": "artist", "count": 8 },{ "book": "birdland", "count": 8 },{ "book": "blueWindow", "count": 8 },{ "book": "fieldNotes", "count": 8 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:20, text:":", books: [ { "book": "artist", "count": 5 },{ "book": "birdland", "count": 5 },{ "book": "blueWindow", "count": 5 },{ "book": "fieldNotes", "count": 5 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:20, text:"x", books: [ { "book": "artist", "count": 5 },{ "book": "birdland", "count": 5 },{ "book": "blueWindow", "count": 5 },{ "book": "fieldNotes", "count": 5 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:20, text:".", books: [ { "book": "artist", "count": 5 },{ "book": "birdland", "count": 5 },{ "book": "blueWindow", "count": 5 },{ "book": "fieldNotes", "count": 5 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:20, text:"+", books: [ { "book": "artist", "count": 5 },{ "book": "birdland", "count": 5 },{ "book": "blueWindow", "count": 5 },{ "book": "fieldNotes", "count": 5 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:20, text:"~", books: [ { "book": "artist", "count": 5 },{ "book": "birdland", "count": 5 },{ "book": "blueWindow", "count": 5 },{ "book": "fieldNotes", "count": 5 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:20, text:"!", books: [ { "book": "artist", "count": 5 },{ "book": "birdland", "count": 5 },{ "book": "blueWindow", "count": 5 },{ "book": "fieldNotes", "count": 5 }],"vowels": {"a": 0,"e": 0,"i": 0,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]},
	{n: 1, count:20, text:"i", books: [ { "book": "artist", "count": 5 },{ "book": "birdland", "count": 5 },{ "book": "blueWindow", "count": 5 },{ "book": "fieldNotes", "count": 5 }],"vowels": {"a": 0,"e": 0,"i": 1,"o": 0,"u": 0},"nvowels": 0, "def": [ {"shortdef": [".||."],"fl": "symbol"},]}
	];

let books = ["birdland","blueWindow","artist","fieldNotes"];

let poemWords = words.filter(w => w.n!==1);
poemWords = [...poemWords, ...poemSymbols];
poemWords = [...poemWords,
	{
		"n": 1,"count": 32,"text": "i","books": [{"book": "artist","count": 20},
		{"book": "birdland","count": 10},
		{"book": "fieldNotes","count": 1},
		{"book": "blueWindow","count": 1}],"vowels": {"a": 0,"e": 0,"i": 1,"o": 0,"u": 0},"nvowels": 1,"def": [{"shortdef": ["the 9th letter of the English alphabet","a graphic representation of this letter","a speech counterpart of orthographic i"],"fl": "noun"},
		{"shortdef": ["industrial","initial","intelligence","intensity","interlaced"],"fl": "abbreviation"},
		{"shortdef": ["imaginary unit"],"fl": "symbol"},
		{"shortdef": ["the one who is speaking or writing"],"fl": "pronoun"},
		{"shortdef": ["someone aware of possessing a personal individuality : self"],"fl": "noun"},
		{"shortdef": ["electric current","interstate"],"fl": "abbreviation"},
		{"shortdef": ["iodine"],"fl": "symbol"},
		{"shortdef": ["—used as a connective vowel to join word elements especially of Latin origin"],"fl": "affix"}]
	}
];
const notwords = ["porn", "but", "the"];

poemWords = poemWords.filter( w => notwords.filter(nw =>  w.text===nw ).length===0);

let pos = [];
poemWords.map( word => {
	word.def.forEach( d=> {
	let fl = d.fl || "unknown";
	console.log(fl);
	if(pos.filter(p => p===fl).length===0) {
			pos.push(fl); console.log(fl);
		}
	})
});
console.log(pos);

let poemWordsText = poemWords.sort( (worda,wordb) => { let a =  worda.text, b =  wordb.text; return (a).localeCompare(b) });
fs.writeFile('outputWordsPoems_withDictionary'+Date.now()+'.js', JSON.stringify(poemWordsText, null, "\t"), 'utf8', e => {console.log("done")});
books.map( book => {
	fs.writeFile('outputWordsPoems_'+book+'_withDictionary_byText'+Date.now()+'.js', JSON.stringify(poemWordsText.filter(w=>{ return w.books.filter(b => b.book===book).length>0 }), null, "\t"), 'utf8', e => {console.log("done")});
});
let poemWordsN = poemWords.sort( (worda,wordb) => worda.n - wordb.n );
fs.writeFile('outputWordsPoems_withDictionary_byN'+Date.now()+'.js', JSON.stringify(poemWordsN, null, "\t"), 'utf8', e => {console.log("done")});
let poemWordsCount = poemWords.sort( (worda,wordb) => worda.count - wordb.count );
fs.writeFile('outputWordsPoems_withDictionary_byCount'+Date.now()+'.js', JSON.stringify(poemWordsCount, null, "\t"), 'utf8', e => {console.log("done")});

