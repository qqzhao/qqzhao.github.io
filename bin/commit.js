
const { execSync }      = require('child_process')
const Git = {
    diff () {
        const n = execSync('git diff --name-only | wc -l').toString().replace(/\n/g, '');
        return n > 0
    },
    add () {
        execSync(`git add --all`);
    },

    commit (msg) {
        execSync(`git commit -am "${msg}" >/dev/null 2>&1`);
    },

    push () {
        execSync('git pull --rebase && git push >/dev/null 2>&1');
    }
}

const task = function  () {
    process.chdir(__dirname);
    if (!Git.diff()) {
        console.log('NO UPDATES');
        return;
    } else {
        console.log('UPDATES FOUND.')
    }
    let date = new Date();

    Git.add();
    Git.commit(`update on [${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}]`);
    Git.push();
}

task()