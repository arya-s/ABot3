var config = require('../config.js');
var fs = require('fs');
var path = require('path');
var pathLoaded = 0;
var PATHS = 2;

module.exports = function(cb){
    var cmds = {};
    var cmdsLoadedCount = 0;
    cmds[config.fetchoperator] = {};
    cmds[config.executeoperator] = {};

    //Read all commands from both fetch and execute directories on bot startup.
    fs.readdir(path.join(__dirname, '..', 'cmd', 'fetch'), function(err, files){
        if(err){
            console.log('Error loading command.', err);
        } else {
            for(var i=0; i<files.length; i++){
                var command = files[i];

                if(command.indexOf('.js') == command.length-3){
                    var cmdName = command.substring(0, command.length-3);
                    var obj = {
                        cmd: '',
                        rights: 0
                    };
                    obj.cmd = require(path.join(__dirname, '..', 'cmd', 'fetch', command));

                    if(cmdName.indexOf('_owner') != -1){
                        obj.rights = 7;
                        cmdName = cmdName.substring(0, cmdName.length-6);
                    } else if(cmdName.indexOf('_private') != -1){
                        obj.rights = 0;
                        cmdName = cmdName.substring(0, cmdName.length-8);
                    } else {
                        obj.rights = 4;
                    }
                    cmds[config.fetchoperator][cmdName] = obj;
                    cmdsLoadedCount++;
                } else {
                    console.log('Invalid file extension on '+command+'. Did not load command.');
                }
            }

            console.log('Done reading fetch directory.');
            console.log('Total fetch cmds: '+cmdsLoadedCount);

            //Done.
            done(cb, cmds);
        }
    });

    fs.readdir(path.join(__dirname, '..', 'cmd', 'execute'), function(err, files){
        if(err){
            console.log('Error loading command.', err);
        } else {
            for(var i=0; i<files.length; i++){
                var command = files[i];

                if(command.indexOf('.js') == command.length-3){
                    var cmdName = command.substring(0, command.length-3);
                    var obj = {
                        cmd: '',
                        rights: 0
                    };
                    obj.cmd = require(path.join(__dirname, '..', 'cmd', 'execute', command));

                    if(cmdName.indexOf('_owner') != -1){
                        obj.rights = 7;
                        cmdName = cmdName.substring(0, cmdName.length-6);
                    } else if(cmdName.indexOf('_private') != -1){
                        obj.rights = 0;
                        cmdName = cmdName.substring(0, cmdName.length-8);
                    } else {
                        obj.rights = 4;
                    }
                    cmds[config.executeoperator][cmdName] = obj;
                    cmdsLoadedCount++;
                } else {
                    console.log('Invalid file extension on '+command+'. Did not load command.');
                }
            }

            console.log('Done reading execute directory.');
            console.log('Total execute cmds: '+cmdsLoadedCount);

            //Done.
            done(cb, cmds);
        }
    });

};

function done(cb, cmds){
    pathLoaded++;
    if(pathLoaded == PATHS){
        cb(cmds);
    }
}
