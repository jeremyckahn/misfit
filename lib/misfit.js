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

const getHighlightedScript = () => scriptList[scriptTable.selected - 1];

var instructions = blessed.text({
  bottom: 0,
  width: '100%',
  content: 'Press ESC, q, or C-c to quit.  Press "c" to copy highlighted command to the clipboard.',
  style: {
    bg: '#0000ff'
  },
  align: 'center'
});

blessedScreen.key(['escape', 'q', 'C-c'], function () {
  return blessedScreen.destroy();
});

scriptTable.focus();
blessedScreen.append(scriptTable);
blessedScreen.append(instructions);
blessedScreen.render();

const getFullNpmCommand = () => `npm run ${getHighlightedScript()}`;

scriptTable.on('select', function (_, i) {
  blessedScreen.destroy();
  shell.exec(getFullNpmCommand());
});

const updateCommandPreview = () => {
  var commandPreview = blessed.text({
    bottom: 1,
    content: packageData.scripts[getHighlightedScript()],
    style: {
      bg: '#88ff44',
      fg: '#000000'
    },
    align: 'left',
    width: '100%'
  });

  blessedScreen.append(commandPreview);
  blessedScreen.render();
};

scriptTable.on('scroll', updateCommandPreview);

scriptTable.key('c', function () {
  var command = getFullNpmCommand();
  var proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(command);
  proc.stdin.end();

  var copyMessage = blessed.text({
    bottom: 2,
    content: `Copied "${command}" to the clipboard!`,
    style: {
      bg: '#ffff88',
      fg: '#000000'
    },
    align: 'left',
    width: '100%'
  });

  blessedScreen.append(copyMessage);
  blessedScreen.render();
});

updateCommandPreview();
