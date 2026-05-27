const common = [
  '--require-module ts-node/register',
  '--require src/hooks/world.ts',
  '--require src/hooks/hooks.ts',
  '--require src/steps/**/*.ts',
  '--format allure-cucumberjs/reporter',
  '--format-options \'{"resultsDir":"allure-results"}\'',
  '--format @cucumber/pretty-formatter',
  '--parallel 1',
].join(' ');

module.exports = {
  default: `${common} src/features/**/*.feature`,
};
