const path = require('path');
const editor = require('mem-fs-editor');
const memFs = require('mem-fs');
const readline = require('readline');

let store = memFs.create();
let fs = editor.create(store);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let questionArray = ['What is your article name :', 'test input: ']
let questionAnswer = []
const inputPara = (question) => {
    return new Promise((resovled, reject) => {
        rl.question(question, (answer) => {
            let name = answer.trim()
            let emptyIndex = name.indexOf(' ')
            // console.log('emptyIndex = ', emptyIndex)
            if (emptyIndex >= 0) {
                name = name.substring(0, emptyIndex)
            } 
        
            if (!name) {
                console.log('Retry! ' + question)
                reject('fail:')
            }
            console.log(`your current answer: ${name}`);
            resovled(name)
        });
    })
}

const writeTask = (inputName) => {
    return new Promise((resolved, reject) => {
        const filepath = path.join(__dirname, '../_posts/template.txt');
        let date = new Date();
        let dataStr = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
        let newFileName = `${dataStr}-${inputName}.md`
        const newPath = path.join(__dirname, '../_posts/' + newFileName)
        console.log(`new path = ${newPath}`)
        fs.copyTpl(filepath, newPath, {name: inputName, data: dataStr});
        fs.commit(() => {
            console.log(`done: ${newPath}`)
            resolved('success')
        })
    })
}

// function start(dbFiles) {
//     return dbFiles.reduce(function(p, file) {
//         return p.then(function(results) {
//             return getMp4(file).then(function(data) {
//                 results.push(data);
//                 return results;
//             });
//         });
//     }, Promise.resolve([]));
// }

// function start(questionArray) {
//     return questionArray.reduce(function(p, item) {
//         return p.then(function(results) {
//             return getMp4(file).then(function(data) {
//                 results.push(data);
//                 return results;
//             });
//         });
//     }, Promise.resolve([]));
// }

(async function taskinit () {
    let index = 0
    let input = await inputPara(questionArray[index])
    questionAnswer[index] = input
    console.log('para = ', questionAnswer)
    writeTask(input)
    rl.close();
})()
