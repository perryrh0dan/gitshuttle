var path = require('path');

var getLineType = function (firstChar) {

    if (firstChar == '+') {
      return 'PLUS';
    } else if (firstChar == '-') {
      return 'MINOR';
    } else {
      return 'UNCHANGED';
    }

  },

  buildDiffTable = function (blockList, lang) {
    var table = [
      '<table class="diff-table">',
        '<tbody>'
    ];

    blockList.forEach(function (block) {
      var lineColumn = {},

        hunk = block.header.split('@')[2].replace(/ /g, '').replace('-', '').split('+'),

        deletionHunk = hunk[0].split(','),

        additionHunk = hunk[1].split(',');

      lineColumn = {
        deletion: {
          startLine: parseInt(deletionHunk[0]),
          amountRemovedLines: parseInt(deletionHunk[1])
        },

        addition: {
          startLine: parseInt(additionHunk[0]),
          amountAddedLines: parseInt(additionHunk[1])
        }
      };

      // Controller variables for line numbers
      var leftNumberColumn = lineColumn.deletion.startLine,
        rightNumberColumn = lineColumn.addition.startLine;

      table.push([
        '<tr class="chunk">',
          '<td class="diff-icon" colspan="2"><span class="octicon octicon-diff"></span></td>',
          '<td colspan="2">', block.header, '</td>',
        '</tr>'
      ].join(''));

      for (var i = 0; i < block.lines.length; i++) {
        var lineCode = block.lines[i].code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
          indicator;

        switch (block.lines[i].type) {
          case 'PLUS':
            indicator = '+';
            break;
          case 'MINOR':
            indicator = '-';
            break;
          default:
            indicator = '';
            break;
        }

        if (block.lines[i].type != 'UNCHANGED') {
          lineCode = lineCode.substr(1);
        }

        var tbLine = [
          '<tr class="' + block.lines[i].type.toLowerCase() + '">',
            '<td class="line-number">',
              ( block.lines[i].type != 'PLUS' ? leftNumberColumn : '' ),
            '</td>',
            '<td class="line-number">',
              ( block.lines[i].type != 'MINOR' ? rightNumberColumn : '' ),
            '</td>',
            '<td class="indicator">',
              indicator,
            '</td>',
            '<td>',
              '<code class="prettyprint ', ( lang ? lang : '' ),'">',
                lineCode,
              '</code>',
            '</td>',
          '</tr>'
        ];

        if (block.lines[i].type == 'PLUS') {
          rightNumberColumn++;
        } else if (block.lines[i].type == 'MINOR') {
          leftNumberColumn++;
        } else {
          rightNumberColumn++;
          leftNumberColumn++;
        }

        table.push(tbLine.join(''));
      }
    });

    table.push('</tbody></table>');

    return table.join('');
  };

function CodeDiffProcessor() {
  this.version = '0.0.1';
}

CodeDiffProcessor.prototype.processCode = function (code, filePath) {
  var lines,
    blocks = [],
    currentBlockIndex,
    extName;

  lines = code.split('\n');

  for (var i = 0; i < lines.length; i++) {

    if (currentBlockIndex) {

      if (lines[i][0] == '@' && lines[i][1] == '@') {

        currentBlockIndex = blocks.push({
          header: lines[i],
          lines: []
        });
      } else {

        blocks[ currentBlockIndex - 1 ].lines.push({
          type: getLineType(lines[i][0]),
          code: lines[i]
        });
      }

    } else {

      if (lines[i][0] == '@' && lines[i][1] == '@') {

        currentBlockIndex = blocks.push({
          header: lines[i],
          lines: []
        });
      }

    }
  }

  if (filePath) {
    extName = 'lang-'.concat( path.extname(filePath).replace('.', '') );
    extName = extName.replace(/(scss|less)/, 'css');
  }

  return buildDiffTable(blocks, extName);
};

module.exports = new CodeDiffProcessor();
