const glob = require('glob');
const fs = require('fs');
const path = require('path');

const changelogHead = '# Change Log';

const changelogDescs = [
  'All notable changes to this project will be documented in this file.',
  'See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.',
];

const featHead = '### Features';

const bugHead = '### Bug Fixes';

const main = ({ path: globPaths, debug }) => {
  const mergeChangelog = (content) => {
    return content
      .split(/\r\n|\n/)
      .filter((line) => {
        if (line) {
          if (
            [changelogHead, ...changelogDescs, '**Note:** Version bump only for package'].some(
              (item) => line.startsWith(item),
            )
          ) {
            return false;
          }
          return true;
        }
        return false;
      })
      .reduce(
        (obj, line) => {
          const { bugList, featList, statusTag, firstVersion } = obj;
          if (line.startsWith(bugHead)) {
            return {
              ...obj,
              statusTag: 'bug',
            };
          }
          if (line.startsWith(featHead)) {
            return {
              ...obj,
              statusTag: 'feat',
            };
          }

          if (!firstVersion && line.match(/#+ \[?\d\.\d\.\d\]?/)) {
            return {
              ...obj,
              firstVersion: line,
            };
          }

          if (line.startsWith('*')) {
            if (statusTag === 'bug') {
              return {
                ...obj,
                bugList: bugList.concat(line),
              };
            }
            if (statusTag === 'feat') {
              return {
                ...obj,
                featList: featList.concat(line),
              };
            }
          }

          return obj;
        },
        {
          bugList: [],
          featList: [],
          statusTag: null,
          firstVersion: '',
        },
      );
  };

  const changelogPaths = path.join(globPaths, 'CHANGELOG.md');

  glob(changelogPaths, {}, (error, fileList) => {
    if (fileList.length === 0) {
      console.log(changelogPaths, 'CHANGELOG.md', '没有发现相关 CHANGELOG.md 文件');
    }

    fileList.forEach((file) => {
      console.log('处理更新日志', file);

      const content = fs.readFileSync(path.join(process.cwd(), file), {
        encoding: 'utf-8',
      });

      const { bugList, featList, firstVersion } = mergeChangelog(content);

      const getTarget = () => {
        const target = path.join(process.cwd(), file);
        if (debug) {
          const { name, dir, ext } = path.parse(target);
          return path.join(dir, `${name}.debug${ext}`);
        }
        return target;
      };

      fs.writeFileSync(
        getTarget(),
        `${changelogHead}\n\n${changelogDescs.join('\n')}\n\n${firstVersion}${
          bugList.length ? `\n\n\n${bugHead}\n\n${bugList.join('\n')}` : ''
        }${featList.length ? `\n\n\n${featHead}\n\n${featList.join('\n')}` : ''}\n`,
        {
          encoding: 'utf-8',
        },
      );
    });
  });
};

module.exports = main;
