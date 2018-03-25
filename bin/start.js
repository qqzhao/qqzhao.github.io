
var c = require('child_process');

var url = 'http://127.0.0.1:4000/'

setTimeout(() => {
    console.log('start page: ', url)
    c.exec('open ' + url);
}, 1000);

// c.exec('open http://127.0.0.1:4000/')