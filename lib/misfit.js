var blessed = require('blessed');
var shell = require('shelljs');
var path = require('path');

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

blessedScreen.key('q', function() {
  return blessedScreen.destroy();
});

scriptTable.focus();
blessedScreen.append(scriptTable);
blessedScreen.render();

scriptTable.on('select', function (_, i) {
  blessedScreen.destroy();
  var selectedScriptName = scriptList[i - 1];
  shell.exec('npm run ' + selectedScriptName);
});
