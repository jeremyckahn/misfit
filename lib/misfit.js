var blessed = require('blessed');
var shell = require('shelljs');
var path = require('path');
var child_process = require('child_process');

var blessedScreen = blessed.screen({
  dump: path.join(__dirname, '../logs/dump.log'),
  autoPadding: false,
  fullUnicode: true,
  warnings: true
});

var listData = [
  ['Select a script to run:'],
];

var packagePath = path.join(shell.pwd(), './package.json');

if (!shell.test('-f', packagePath)) {
  shell.echo('misfit: No package.json file found in ' + shell.pwd());
  process.exit(0);
}

var packageData = require(packagePath);
var scriptList = Object.keys(packageData.scripts || {});

if (scriptList.length === 0) {
  shell.echo('misfit: No npm scripts to run.');
  process.exit(0);
}

scriptList.forEach(script => listData.push([script]));

var scriptTable = blessed.listtable({
  top: 'center',
  left: 'center',
  data: listData,
  align: 'left',
  tags: true,
  keys: true,
  width: '100%',
  height: '100%',
  vi: true,
  mouse: true,
  style: {
    border: {
      fg: 'red'
    },
    header: {
      fg: 'blue',
      bold: true
    },
    cell: {
      fg: 'magenta',
      selected: {
        bg: 'blue'
      }
    }
  }
});

var instructions = blessed.text({
  bottom: 0,
  width: '100%',
  content: 'Press ESC, q, or C-c to quit',
  style: {
    bg: '#0000ff'
  },
  align: 'center'
});

blessedScreen.key(['escape', 'q', 'C-c'], function() {
  return blessedScreen.destroy();
});

scriptTable.focus();
blessedScreen.append(scriptTable);
blessedScreen.append(instructions);
blessedScreen.render();

scriptTable.on('select', function (_, i) {
  blessedScreen.destroy();
  var selectedScriptName = scriptList[i - 1];

  var runner = child_process.exec('npm run ' + selectedScriptName, {
    env: Object.assign({
      FORCE_COLOR: true,
      MOCHA_COLORS: true
    }, process.env)
  });

  runner.stdout.on('data', function (data) {
    // Don't print if `data` is only a carriage return
    if (data.length === 1 && data.charCodeAt(0) === 13) {
      return;
    }

    shell.echo(data.toString().replace(/\n$/, ''));
  });
});
