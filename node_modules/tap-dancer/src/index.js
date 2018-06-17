const Transform = require('stream').Transform
const parser = require('tap-out');
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');
const PAD = '  '
const icons = {
  failure: chalk.red(process.platform === 'linux' ? '✘' : 'x'),
  success: chalk.green(process.platform === 'linux' ? '•' : '.'),
}
//add commas to numbers
const pretty = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function padRight(pad, str) {
  if (typeof str === 'undefined') {
    return pad;
  }
  return (str + pad).substring(0, pad.length);
}

class TapDance extends Transform {
  constructor() {
    super();
    this.parser = parser();
    this.extra = [];
    this.assertCount = 0;
    this.timestamp = Date.now();
    this.failed = false;

    this.outLine();

    this.parser.on('assert', res => {
      if (res.ok) {
        this.push(icons.success);
      } else {
        this.push(icons.failure);
        this.failed = true;
      }
      this.assertCount++;
    });

    this.parser.on('extra', str => {
      if (str !== '') this.extra.push(str);
    });

    this.on('finish', () => this.parser.end());
  }

  _transform(chunk, encoding, cb) {
    this.parser.write(chunk, encoding, cb);
  }

  _flush(callback) {
    this.parser.on('output', result => {
      if ((result.fail && result.fail.length) || this.assertCount === 0) {
        this.outSpacer(2);
        this.outputExtra();
        this.statsOutput(result);
        this.outSpacer(2);

        this.outLine();
        _(result.fail)
          .map(a => _.defaults({
            test: _.find(result.tests, ['number', a.test])
          }, a))
          .groupBy(a => a.test.number)

          .forEach(test => {
            const testName = test[0].test.name;
            //print the path to the test
            let shortPath = test[0].error.at.file.replace(/^.+test\//, '');
            shortPath = path.relative(process.cwd(), shortPath);
            shortPath = './' + shortPath
            const line = test[0].error.at.line;
            if (line || line === 0) {
              shortPath += ':' + line
            }
            this.outLine(`${chalk.red('x')} ${chalk.white(chalk.underline(testName))}   ${chalk.grey(shortPath)}`);
            this.outLine();
            _.forEach(test, assertion => {
              let name = (assertion.name || '')
              name = padRight('                        ', name);
              this.push(chalk.white(`    ${chalk.red('-')} ${name}`));
              let actual = assertion.error.actual
              if (typeof actual === 'string' && actual.length > 100) {
                actual = actual.substr(0, 100) + '..'
              }
              this.push(chalk.gray(`    - got: ${chalk.magenta('"' + actual + '"')}`));
              this.outLine();
            });
            this.outLine();
          });
        this.outLine();
      } else {
        this.outSpacer(2);
        this.statsOutput(result);
        this.outLine();
        this.outLine();
      }
      callback();
    });
  }

  outputExtra() {
    this.push(this.extra.join('\n'));
  }

  outPush(str = '', color = 'white') {
    this.push(`${PAD}${chalk[color](str)}`);
  }

  outLine(str = '', color = 'white') {
    this.outPush(`${str}
`, color);
  }

  outSpacer(num = 1) {
    this.push('\n'.repeat(num));
  }

  statsOutput(res) {
    const time = ((Date.now() - this.timestamp) / 1000).toFixed(2);
    const assertTotal = pretty(res.asserts.length);
    const assertPass = pretty(res.pass.length);
    const assertFail = res.fail.length

    //amount correct
    let line1 = `${PAD}${chalk.green(assertPass)} of ${assertTotal}`
    this.push(line1)

    this.outLine();

    //print time if passed
    if (assertFail === 0) {
      let line2 = PAD
      line2 += chalk.gray(' ✔️     ' + time + 's')
      this.push(line2)
    } else {
      let noun = 'failure'
      if (assertFail > 1) {
        noun = 'failures'
      }
      this.outLine(`${pretty(assertFail)} ${noun} ◠◡◜◠◡-◡◜`, 'red');
    }
  }
}

module.exports = TapDance
