'use strict';

var ENV = process.env,
  wos = require('node-wos'),
  GitUrlParse = require('git-url-parse');

ENV.LANG = 'en_US';

/**
 * @class Git
 * Minimal wrapper to perform git operations
 */
function Git() {
  this.whoami = 'Git class that perform git operations';
}

/**
 * @private
 * @method performCommand
 * Perform commands on a standardized way and return it as a Promise
 * @param {string} command
 * @param {string} cwd
 * @return {Promise<string>} callback
 */
function performCommand(command, cwd) {
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
Git.prototype.getCurrentBranch = function(path, callback) {
  return performCommand('git branch -r && git branch', path)
    .then(stdout => {
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
};

/**
 * @method getCommitHistory - Return a array with the commit history
 *
 * @param  {object} opts - Path of the git repository
 * - {string} path - Path of the git repository
 * - {Number} skip - Number of commits to skip
 * @param  {function} callback - Callback to be execute in error or success case
 */
Git.prototype.getCommitHistory = function(opts) {
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

  return performCommand(command, opts.path)
    .then(stdout => {
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
};

/**
 * @method getStatus - Return the status of the repository
 *
 * @param  {string} path - Path of the git repository
 * @param  {function} callback - Callback to be execute in error or success case
 */
Git.prototype.getStatus = function(path) {
  return performCommand('git status -sb', path).then(stdout => {
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
  });
};

// /**
//  * @method fetch - Fetch with --prune flag the repository
//  *
//  * @param  {string} path - Path of the git repository
//  * @param  {function} callback - Callback to be execute in error or success case
//  */
// Git.prototype.fetch = function (path, callback) {
//   performCommand('git fetch --prune', path, callback);
// };

Git.prototype.getDiff = function(opts, callback) {
  return performCommand(
    `git diff --numstat ${opts.ancestorHash} ${opts.hash}`,
    opts.path
  ).then(stdout => {
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
};

Git.prototype.getUnsyncFileDiff = function(opts, callback) {
  opts = opts || {};

  var path = opts.path,
    file = opts.file;

  return performCommand(`git diff HEAD "${file.trim()}"`, path);
};

Git.prototype.getFileDiff = function(opts) {
  return performCommand(
    `git log --format=\'%N\' -p -1 ${opts.hash} -- "${opts.file}"`,
    opts.path
  );
};

// Git.prototype.sync = function (opts, callback) {
//   opts = opts || {};

//   this.listRemotes(opts.path, function (err, repositoryRemotes) {
//     var gitFetchURL = GitUrlParse(repositoryRemotes.origin.fetch);
//     var gitPushURL = GitUrlParse(repositoryRemotes.origin.push);
//     var fetchOrigin = 'origin';
//     var pushOrigin = 'origin';

//     if (gitFetchURL.protocol == 'https' && opts.httpsConfigs) {
//       fetchOrigin = 'https://' + opts.httpsConfigs.username + ':' + opts.httpsConfigs.password + '@' + gitFetchURL.source + gitFetchURL.pathname;
//     }

//     if (gitPushURL.protocol == 'https' && opts.httpsConfigs) {
//       pushOrigin = 'https://' + opts.httpsConfigs.username + ':' + opts.httpsConfigs.password + '@' + gitPushURL.source + gitPushURL.pathname;
//     }

//     if (opts.setUpstream) {

//       if (gitPushURL.protocol == 'https' && !opts.httpsConfigs) {
//         invokeCallback(opts.noHTTPAuthcallback, [gitFetchURL, gitPushURL]);
//       } else {
//         performCommand(`git push -u ${pushOrigin} ${opts.branch}`, opts.path, callback);
//       }
//     } else {

//       performCommand(`git pull ${fetchOrigin}`, opts.path, function (error, stdout, stderr) {

//         if (error) {

//           invokeCallback(callback, [error]);
//         } else if (opts.push) {

//           if (gitPushURL.protocol == 'https' && !opts.httpsConfigs) {
//             invokeCallback(opts.noHTTPAuthcallback, [gitFetchURL, gitPushURL]);
//           } else {
//             performCommand(`git push ${pushOrigin} ${opts.branch}`, opts.path, callback);
//           }
//         } else {

//           invokeCallback(callback, [error]);
//         }
//       });
//     }
//   });
// };

// Git.prototype.add = function (path, opts) {
//   opts = opts || {};

//   let command = '';

//   if (opts.files instanceof Array) {

//     for (let i = 0; i < opts.files.length; i++) {
//       command = command.concat(`git add "${opts.files[i]}"`);

//       if (i != (opts.files.length - 1)) {
//         command = command.concat(' && ');
//       }
//     }
//   } else {
//     command = `git add "${opts.files}"`;
//   }

//   performCommand(command, path, opts.callback);
// };

// Git.prototype.commit = function (path, opts) {
//   var commad = 'git commit -m "'.concat((opts.message.replace(/"/g, '\\"'))).concat('"');

//   if (opts.description) {

//     if (wos.isWindows()) {
//       commad = commad + ' -m "' + opts.description.replace(/"/g, '\\"').replace(/\n/g, '" -m "') + '"';
//     } else {
//       commad = commad.concat(' -m "').concat((opts.description.replace(/"/g, '\\"'))).concat('"');
//     }
//   }

//   performCommand(commad, path, opts.callback);
// };

Git.prototype.push = function(path, opts) {
  let command = `git push ${opts.remote} ${opts.branch}`;

  return performCommand(command, path);
};

// Git.prototype.switchBranch = function (opts, callback) {
//   opts = opts || {};

//   var path = opts.path,
//     branch = opts.branch,
//     forceCreateIfNotExists = opts.forceCreateIfNotExists;

//   performCommand('git checkout ' + (forceCreateIfNotExists ? ' -b ' : '') + branch, path, callback);
// };

// Git.prototype.getCommitCount = function (path, callback) {
//   performCommand('git rev-list HEAD --count', path, callback);
// };

Git.prototype.showRemotes = function(path) {
  return performCommand('git remote -v', path);
};

Git.prototype.listRemotes = function(path) {
  return performCommand('git remote show', path)
    .then(stdout => {
      let repositoryRemotes = {};
      let remoteShowLines = stdout.split('\n');

      remoteShowLines.forEach(function(line) {
        if (line) {
          repositoryRemotes[line.trim()] = {};
        }
      });

      if (Object.keys(repositoryRemotes).length > 0) {
        return this.showRemotes(path).then(remotes => {
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
        error.code = 'ENOREMOTE';

        return error;
      }
    })
    .catch(error => {
      return error;
    });
};

// Git.prototype.discartChangesInFile = function (path, opts) {
//   var command = '';

//   opts = opts || {};

//   if (opts.files instanceof Array) {

//     for (let i = 0; i < opts.files.length; i++) {

//       if (opts.files[i].isUnknow) {
//         command = command.concat(`git clean -df "${opts.files[i].path.trim()}"`);
//       } else {
//         command = command.concat(`git checkout -- "${opts.files[i].path.trim()}"`);
//       }

//       if (i != (opts.files.length - 1)) {
//         command = command.concat(' && ');
//       }
//     }
//   } else {

//     if (opts.files.isUnknow) {
//       command = `git clean -df "${opts.files.path.trim()}"`;
//     } else {
//       command = `git checkout -- "${opts.files.path.trim()}"`;
//     }
//   }

//   performCommand(command, path, opts.callback);
// };

// Git.prototype.unstageFile = function (path, opts) {
//   opts = opts || {};

//   performCommand(`git reset "${opts.file.trim()}"`, path, opts.callback);
// };

// Git.prototype.getTag = function (path, callback) {

//   performCommand('git tag', path, function (error, stdout, stderr) {
//     var err = null,
//       tags = [];

//     if (error !== null) {
//       err = error.message;
//     } else {
//       var lines = stdout.split('\n');

//       lines.forEach(function (tag) {

//         if (tag !== '') {
//           tags.push(tag);
//         }
//       });
//     }

//     invokeCallback(callback, [err, tags]);
//   });
// };

// Git.prototype.assumeUnchanged = function (path, opts) {
//   performCommand(`git update-index --assume-unchanged "${opts.file}"`, path, opts.callback);
// };

// Git.prototype.clone = function (opts) {
//   opts = opts || {};

//   performCommand(`git clone --recursive ${opts.cloneURL}`, opts.destinyFolder, opts.callback);
// };

// Git.prototype.reset = function (path, opts) {

//   performCommand(`git reset --soft ${opts.hash}`, path, opts.callback);
// };

// Git.prototype.createRepository = function (opts) {
//   var fs = require('fs'),
//     path = require('path'),
//     err = null;

//   opts = opts || {};

//   fs.writeFile(path.join(opts.repositoryHome, '.gitignore'), '// # Logs and databases # \n ####################### \n *.log \n *.sql \n .sqlite', 'utf8', function (errFile) {

//     if (errFile) {
//       err = errFile.message;

//       invokeCallback(opts.callback, [err]);
//     } else {

//       // FIXME: Pretty callback hell :')
//       performCommand('git init', opts.repositoryHome, function (err) {

//         this.switchBranch({
//             path: opts.repositoryHome,
//             branch: 'master',
//             forceCreateIfNotExists: true
//           },
//           function (err) {

//             this.add(opts.repositoryHome, {
//               files: '.gitignore',
//               callback: function (err) {

//                 this.commit(opts.repositoryHome, {
//                   message: '.gitignore',
//                   callback: opts.callback
//                 });

//               }.bind(this)
//             });

//           }.bind(this));

//       }.bind(this));
//     }

//   }.bind(this));
// };

// Git.prototype.getStashList = function (path, callback) {

//   performCommand('git stash list --pretty=format:%gd-gtseparator-%gn-gtseparator-%gs', path, function (error, stdout, stderr) {
//     var err = null,
//       stashs = [];

//     if (error !== null) {
//       err = error.message;
//     } else {
//       var lines = stdout.split('\n');

//       lines.forEach(function (stash) {

//         if (stash !== '') {
//           var stashInfo = stash.split('-gtseparator-');

//           stashs.push({
//             reflogSelector: stashInfo[0],
//             author: stashInfo[1],
//             subject: stashInfo[2]
//           });
//         }
//       });
//     }

//     invokeCallback(callback, [err, stashs]);
//   });
// };

// Git.prototype.stashChanges = function (path, callback) {
//   performCommand('git stash', path, callback);
// };

// Git.prototype.dropStash = function (path, opts) {
//   performCommand(`git stash drop ${opts.reflogSelector}`, path, opts.callback);
// };

// Git.prototype.popStash = function (path, opts) {
//   performCommand(`git stash pop ${opts.reflogSelector}`, path, opts.callback);
// };

// Git.prototype.showStash = function (path, opts) {

//   performCommand(`git stash show ${opts.reflogSelector} --numstat`, path, function (error, stdout) {
//     var lines = stdout.split('\n'),
//       files = [];

//     lines.forEach(function (line) {

//       if (line) {
//         var props = line.split('\t');

//         files.push({
//           name: props[2],
//           additions: parseInt(props[0]),
//           deletions: parseInt(props[1]),
//           isBinary: (props[0] == '-' || props[1] == '-') ? true : false
//         });
//       }
//     });

//     invokeCallback(opts.callback, [error, files]);
//   });
// };

// Git.prototype.diffStashFile = function (path, opts) {
//   performCommand(`git diff ${opts.reflogSelector} -- "${opts.fileName.trim()}"`, path, opts.callback);
// };

Git.prototype.getGlobalConfigs = function() {
  return performCommand('git config --global -l').then(stdout => {
    let configs = {};
    var lines = stdout.split('\n');

    lines.forEach(function(line) {
      if (line) {
        var config = line.split('=');
        configs[config[0].trim()] = config[1].trim();
      }
    });
  });
};

Git.prototype.getLocalConfigs = function(path) {
  return performCommand('git config -l', path).then(stdout => {
    let configs = {};
    var lines = stdout.split('\n');

    lines.forEach(function(line) {
      if (line) {
        var config = line.split('=');
        configs[config[0].trim()] = config[1].trim();
      }
    });
  });
};

// Git.prototype.alterGitConfig = function (path, opts) {
//   var command,
//     execOpts = {
//       env: ENV
//     },
//     concatConfig = function (name, value) {

//       if (value) {

//         if (command) {
//           command = command.concat(' && ');
//         } else {
//           command = '';
//         }

//         command = command.concat('git config ');

//         if (opts.global) {
//           command = command.concat('--global ');
//         }

//         command = command.concat(name).concat(' ').concat(value);
//       }
//     };

//   opts = opts || {};

//   concatConfig('user.name', `"${opts.username}"`);
//   concatConfig('user.email', `"${opts.email}"`);

//   if (opts.mergeTool) {
//     concatConfig('merge.tool', opts.mergeTool);

//     if (wos.isWindows()) {
//       concatConfig(`mergetool.${opts.mergeTool}.cmd`, `\"${opts.mergeTool}.exe $PWD/$LOCAL $PDW/$MERGED $PWD/$REMOTE\"`);
//       concatConfig(`mergetool.${opts.mergeTool}.trustExitCode`, 'true');
//     } else {
//       concatConfig(`mergetool.${opts.mergeTool}.cmd`, `'${opts.mergeTool} "$LOCAL" "$MERGED" "$REMOTE"'`);
//       concatConfig(`mergetool.${opts.mergeTool}.trustExitCode`, 'true');
//     }
//   }

//   if (!opts.global) {
//     execOpts.cwd = path;
//   }

//   if (command) {
//     performCommand(command, execOpts.cwd, opts.callback);
//   }
// };

// Git.prototype.useOurs = function (path, opts) {
//   opts = opts || {};

//   performCommand(`git checkout --ours "${opts.fileName}"`, path, opts.callback);
// };

// Git.prototype.useTheirs = function (path, opts) {
//   opts = opts || {};

//   performCommand(`git checkout --theirs "${opts.fileName}"`, path, opts.callback);
// };

// Git.prototype.deleteBranch = function (path, opts) {
//   opts = opts || {};

//   performCommand(`git branch -D ${opts.branchName}`, path, opts.callback);
// };

// Git.prototype.getCommitDiff = function (path, opts) {
//   opts = opts || {};
//   let command = `git log --pretty=%an-gtseparator-%h-gtseparator-%s-gtseparator-%aD ${opts.branchBase.trim()}..${opts.branchCompare.trim()}`;

//   performCommand(command, path, function (error, stdout) {
//     let commits;

//     if (!error) {
//       commits = [];

//       let lines = stdout.split('\n');

//       for (let i = 0; i < lines.length; i++) {

//         if (lines[i]) {
//           let commitInfo = lines[i].split('-gtseparator-');

//           commits.push({
//             author: commitInfo[0],
//             hash: commitInfo[1],
//             message: commitInfo[2],
//             date: new Date(commitInfo[3])
//           });
//         }
//       }
//     }

//     invokeCallback(opts.callback, [error, commits]);
//   });
// };

// Git.prototype.geDiffMerge = function (path, opts) {
//   opts = opts || {};

//   performCommand(`git diff ${opts.branchBase}...${opts.branchCompare} --numstat --shortstat`, path, function (error, stdout) {
//     if (error) {
//       invokeCallback(opts.callback, [error]);
//     } else {
//       let diffInformation = {
//         shortstat: null,
//         files: []
//       };
//       let lines = stdout.split('\n');

//       for (let i = 0; i < (lines.length - 2); i++) {

//         if (lines[i]) {
//           let props = lines[i].split('\t');

//           diffInformation.files.push({
//             name: props[2],
//             additions: parseInt(props[0]),
//             deletions: parseInt(props[1]),
//             isBinary: (props[0] == '-' || props[1] == '-') ? true : false
//           });
//         }
//       }

//       diffInformation.shortstat = lines[(lines.length - 2)];

//       invokeCallback(opts.callback, [error, diffInformation]);
//     }
//   });
// };

// Git.prototype.merge = function (path, opts) {
//   opts = opts || {};

//   performCommand(`git merge ${opts.branchCompare}`, path, function (error, stdout, stderr) {
//     let isConflituosMerge = false;

//     if (error && stdout.toString().indexOf('Automatic merge failed') > -1) {
//       isConflituosMerge = true;
//     }

//     invokeCallback(opts.callback, [error, stdout, isConflituosMerge]);
//   });
// };

// Git.prototype.mergeAbort = function (path, callback) {
//   performCommand('git merge --abort', path, callback);
// };

// Git.prototype.isMerging = function (path) {
//   let fs = require('fs');
//   let pathModule = require('path');

//   try {
//     let statRepository = fs.statSync(pathModule.join(path, '.git', 'MERGE_HEAD'));

//     return statRepository.isFile();
//   } catch (err) {
//     return false;
//   }
// };

// Git.prototype.mergeTool = function (path, callback) {
//   performCommand('git mergetool -y', path, callback);
// };

module.exports = new Git();
