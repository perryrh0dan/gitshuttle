var ENV = process.env;
const wos = require('node-wos');
const GitUrlParse = require('git-url-parse');

ENV.LANG = 'en_US';

class Git {
  performCommand(command, cwd?) {
    let path = cwd;

    const exec = require('child_process').exec;

    return new Promise((resolve, reject) => {
      exec(
        command,
        {
          cwd: path,
          env: ENV
        },
        (error, stdout, stderr) => {
          if (error) {
            reject(stderr);
          }
          resolve(stdout);
        }
      );
    });
  }

  /**
   * @method getCurrentBranch - Return current branch of a git repository
   *
   * @param  {string} path - Path of the git repository
   * @return {Promise}
   */
  getCurrentBranch(path) {
    return this.performCommand('git branch -r && git branch', path)
      .then((stdout: String) => {
        var lines = stdout.split('\n'),
          currentBranch,
          localBranches = [],
          remoteBranches = [],
          branchesDictionary = {};

        for (let i = 0; i < lines.length; i++) {
          let isRemote = lines[i].indexOf('origin/') > -1;
          let isHEAD = lines[i].indexOf('HEAD ->') > -1;
          let existsInAnyList = branchesDictionary[lines[i].trim()];

          if (!existsInAnyList && !isHEAD && lines[i]) {
            if (isRemote) {
              lines[i] = lines[i].replace('origin/', '').trim();
              remoteBranches.push(lines[i]);
            } else {
              if (lines[i].indexOf('*') > -1) {
                lines[i] = lines[i].replace('*', '').trim();

                currentBranch = lines[i];

                if (!branchesDictionary[lines[i].trim()]) {
                  localBranches.push(lines[i].trim());
                }

                continue;
              }

              localBranches.push(lines[i].trim());
            }

            branchesDictionary[lines[i].trim()] = lines[i].trim();
          }
        }

        return {
          currentBranch: currentBranch,
          remoteBranches: remoteBranches,
          localBranches: localBranches
        };
      })
      .catch(error => {
        return error;
      });
  }

  /**
   * @method getStatus - Return the status of the repository
   *
   * @param  {string} path - Path of the git repository
   * @param  {Promise}
   */
  getStatus(path) {
    return this.performCommand('git status -sb', path).then(
      (stdout: String) => {
        var syncStatus = {
            ahead: null,
            behind: null
          },
          files = [],
          lines = stdout.split('\n'),
          unsynChanges,
          unsyncParts;

        // First line ever is the sync numbers status
        unsynChanges = lines[0].substring(
          lines[0].lastIndexOf('[') + 1,
          lines[0].lastIndexOf(']')
        );

        unsyncParts = unsynChanges.split(',');

        unsyncParts.forEach(function(i) {
          var item = i.trim();

          if (item.indexOf('ahead') > -1) {
            syncStatus.ahead = item
              .substring(item.lastIndexOf('ahead') + 5, item.length)
              .trim();
          } else if (item.indexOf('behind') > -1) {
            syncStatus.behind = item
              .substring(item.lastIndexOf('behind ') + 6, item.length)
              .trim();
          }
        });

        for (var i = 1; i < lines.length; i++) {
          if (lines[i]) {
            let staged = false,
              referenceChar,
              X = lines[i][0],
              Y = lines[i][1],
              statusItem;

            if (lines[i][0] != ' ' && lines[i][0] != '?') {
              referenceChar = lines[i][0];
              staged = true;
            } else {
              referenceChar = lines[i][1];
            }

            lines[i] = lines[i]
              .substring(2)
              .replace(/"/g, '')
              .trim();

            statusItem = {
              displayPath: lines[i],
              path: lines[i],
              staged: staged,
              X: X,
              Y: Y
            };

            switch (referenceChar.toLocaleUpperCase()) {
              case 'R':
                statusItem.type = 'RENAMED';
                statusItem.path = lines[i].split('->')[1].trim();
                break;

              case 'M':
                statusItem.type = 'MODIFIED';
                break;

              case '?':
                statusItem.type = 'NEW'; //UNTRACKED
                break;

              case 'A':
                statusItem.type = 'ADDED';
                break;

              case 'D':
                statusItem.type = 'DELETED';
                break;

              case 'U':
                statusItem.type = 'UNMERGED';
                statusItem.staged = false; // TODO: Improve indicators to UNMERGED files
                break;
            }

            files.push(statusItem);
          }
        }

        return {
          syncStatus,
          files
        };
      }
    );
  }

  /**
   * @method getCommitHistory - Return a array with the commit history
   *
   * @param  {object} - Options object
   * - {string} path - Path of the git repository
   * - {Number} skip - Number of commits to skip
   * - {Object} filter - Filter object
   * @param  {Promise}
   */
  getCommitHistory(opts) {
    let skip = opts.skip ? `--skip ${opts.skip}` : '',
      filter = '',
      command;

    if (opts.filter && opts.filter.text) {
      switch (opts.filter.type) {
        case 'MESSAGE':
          filter = `--grep="${opts.filter.text}"`;
          break;
        case 'AUTHOR':
          filter = `--author="${opts.filter.text}"`;
          break;
        case 'FILE':
          filter = `-- ${opts.filter.text}`;
          break;
      }
    }

    command = `git --no-pager log -n 25 --pretty=format:%an-gtseparator-%cr-gtseparator-%h-gtseparator-%s-gtseparator-%b-gtseparator-%ae-gtseparator-%p-pieLineBreak- ${skip} ${filter}`;

    return this.performCommand(command, opts.path)
      .then((stdout: String) => {
        var lines = stdout.split('-pieLineBreak-'),
          historyList = [];

        for (var i = 0; i < lines.length; i++) {
          if (lines[i] !== '') {
            var historyItem = lines[i].split('-gtseparator-');

            historyList.push({
              user: historyItem[0],
              date: historyItem[1],
              hash: historyItem[2],
              message: historyItem[3],
              body: historyItem[4],
              email: historyItem[5],
              parentHash: historyItem[6]
            });
          }
        }

        return historyList;
      })
      .catch(error => {
        return error;
      });
  }

  /**
   * @method fetch - Fetch with --prune flag the repository
   *
   * @param  {string} path - Path of the git repository
   * @param  {Prmoise}
   */
  fetch(path) {
    return this.performCommand('git fetch --prune', path);
  }

  /**
   * @method getDiff
   *
   * @param  {object} - Options object
   * - {string} path - Path of the git repository
   * - {string} ancestorHash - Hash of parent commit
   * - {string} hash - Hash of commit
   * @param  {Prmoise}
   */
  getDiff(opts) {
    return this.performCommand(
      `git diff --numstat ${opts.ancestorHash} ${opts.hash}`,
      opts.path
    ).then((stdout: string) => {
      var files = [];

      var lines = stdout.split('\n');

      lines.forEach(function(line) {
        if (line) {
          var props = line.split('\t');

          files.push({
            name: props[2],
            additions: parseInt(props[0]),
            deletions: parseInt(props[1]),
            isBinary: props[0] == '-' || props[1] == '-' ? true : false
          });
        }
      });

      return files;
    });
  }

  /**
   * @method getUnsyncFileDiff
   *
   * @param  {object} - Options object
   * - {string} path - Path of the git repository
   * - {string} file - File path
   * @param  {Prmoise}
   */
  getUnsyncFileDiff(opts) {
    opts = opts || {};

    const path = opts.path,
      file = opts.file;

    return this.performCommand(`git diff HEAD "${file.trim()}"`, path);
  }

  /**
   * @method getUnsyncFileDiff
   *
   * @param  {object} - Options object
   * - {string} path - Path of the git repository
   * - {string} hash - Hash of the commit
   * - {string} file - File path
   * @param  {Prmoise}
   */
  getFileDiff(opts) {
    return this.performCommand(
      `git log --format=\'%N\' -p -1 ${opts.hash} -- "${opts.file}"`,
      opts.path
    );
  }

  showRemotes(path) {
    return this.performCommand('git remote -v', path);
  }

  listRemotes(path) {
    return this.performCommand('git remote show', path)
      .then((stdout: string) => {
        let repositoryRemotes = {};
        let remoteShowLines = stdout.split('\n');

        remoteShowLines.forEach(function(line) {
          if (line) {
            repositoryRemotes[line.trim()] = {};
          }
        });

        if (Object.keys(repositoryRemotes).length > 0) {
          return this.showRemotes(path).then((remotes: string) => {
            var remoteList = remotes.split('\n');
            for (var remote in repositoryRemotes) {
              for (let i = 0; i < remoteList.length; i++) {
                if (remoteList[i].indexOf(remote) > -1) {
                  if (remoteList[i].indexOf('(push)') > -1) {
                    repositoryRemotes[remote].push = remoteList[i]
                      .replace('(push)', '')
                      .replace(remote, '')
                      .trim();
                  } else if (remoteList[i].indexOf('(fetch)')) {
                    repositoryRemotes[remote].fetch = remoteList[i]
                      .replace('(fetch)', '')
                      .replace(remote, '')
                      .trim();
                  }
                }
              }
            }

            return repositoryRemotes;
          });
        } else {
          let error = new Error(`The repository do not have any remote`);
          // error.code = 'ENOREMOTE';

          return error;
        }
      })
      .catch(error => {
        return error;
      });
  }

  getGlobalConfigs() {
    return this.performCommand('git config --global -l').then(
      (stdout: string) => {
        let configs = {};
        var lines = stdout.split('\n');

        lines.forEach(function(line) {
          if (line) {
            var config = line.split('=');
            configs[config[0].trim()] = config[1].trim();
          }
        });
      }
    );
  }

  getLocalConfigs(path) {
    return this.performCommand('git config -l', path).then((stdout: string) => {
      let configs = {};
      var lines = stdout.split('\n');

      lines.forEach(function(line) {
        if (line) {
          var config = line.split('=');
          configs[config[0].trim()] = config[1].trim();
        }
      });
    });
  }

  discartChangesInFile(path, opts) {
    var command = '';

    opts = opts || {};

    if (opts.files instanceof Array) {
      for (let i = 0; i < opts.files.length; i++) {
        if (opts.files[i].isUnknow) {
          command = command.concat(
            `git clean -df "${opts.files[i].path.trim()}"`
          );
        } else {
          command = command.concat(
            `git checkout -- "${opts.files[i].path.trim()}"`
          );
        }

        if (i != opts.files.length - 1) {
          command = command.concat(' && ');
        }
      }
    } else {
      if (opts.files.isUnknow) {
        command = `git clean -df "${opts.files.path.trim()}"`;
      } else {
        command = `git checkout -- "${opts.files.path.trim()}"`;
      }
    }

    return this.performCommand(command, path);
  }
}

module.exports = new Git();
