module.exports = function (config) {
  config.set({
    frameworks: [ 'jasmine' ],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/es6-promise/dist/es6-promise.js',
      './node_modules/whatwg-fetch/dist/fetch.js',
      'src/fetch-mock.js',
      'tests/**/*_spec.js'
    ],
    singleRun: true,
    autoWatch: false,
    plugins: ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-coverage'],
    browsers: [ 'PhantomJS' ],
    reporters: [ 'progress', 'coverage' ],
    coverageReporter: {
      dir: 'build/reports/coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' }
      ]
    }
  });
};
