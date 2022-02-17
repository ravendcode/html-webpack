// import $ from 'jQuery';
// $('.container').prepend('jQuery');

// import _ from 'lodash';
// console.log(_.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }));

require( '../blocks/header/header.js').default();

console.log('index.js', process.env.NODE_ENV);
console.log(__webpack_public_path__);
