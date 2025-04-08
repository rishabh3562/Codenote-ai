export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'test', 'ui'], // Custom types
    ],
    'scope-enum': [
      1, // Warning level for scope
      'always',
      ['auth', 'button', 'ui', 'format'], // Custom scopes
    ],
    'subject-max-length': [2, 'always', 72], // Subject length limit
    'scope-case': [2, 'always', 'lower-case'], // Ensure lowercase scopes
  },
};

/*
The 2 in the commitlint rule configuration represents the severity level of the rule. Commitlint uses a numerical system to set the severity for each rule:

0: Off – The rule is disabled.
1: Warning – The rule will show a warning but will not block the commit.
2: Error – The rule will cause an error, blocking the commit if violated.

*/
// module.exports = {
//   extends: ['@commitlint/config-conventional'],
//   rules: {
//     'type-enum': [
//       2,
//       'always',
//       [
//         'feat', // new feature
//         'fix', // bug fix
//         'docs', // documentation
//         'style', // formatting
//         'refactor', // code refactoring
//         'test', // adding tests
//         'chore', // maintenance
//       ],
//     ],
//   },
// };
