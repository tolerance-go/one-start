const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const tagsTxt = fs.readFileSync(path.join(process.cwd(), '.temp', 'tags.txt'), {
  encoding: 'utf-8',
});

const tags = tagsTxt.split(/\r\n|\n/);

console.log(tags.filter(Boolean));

shell.exec(
  `git push origin ${tags
    .filter(Boolean)
    .map((tag) => `:refs/tags/${tag}`)
    .join(' ')}`,
);
