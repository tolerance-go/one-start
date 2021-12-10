const checkCircular = require('./circular-depends');
const checkLevelDepends = require('./level-depends');
const chalk = require('chalk');

checkCircular().then((circularCheckSuccess) => {
  const levelCheckSuccess = checkLevelDepends();

  if (!circularCheckSuccess || !levelCheckSuccess) {
    process.exit(1);
  }
});
