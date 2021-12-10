const pkg = require(process.cwd(), 'package.json');

module.exports = {
  server: {
    branch: 'master',
    name: pkg.name,
    git: pkg.repository,
    username: 'root',
    ip: '10.1.5.111',
    path: '/root/',
    hooks: {
      'after-install': 'yarn site',
    },
  },
};
