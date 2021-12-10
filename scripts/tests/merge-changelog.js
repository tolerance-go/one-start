const shell = require('shelljs');

shell.exec(`node ./scripts/cli/merge-changelog.js --path ./scripts/tests --debug`);
