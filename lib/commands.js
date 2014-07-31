var _commands = require('./_commands.json').commands;
var extend = require('util')._extend;

var ScriptRunner = require('./script_runner');

var Namespaces = {};

function CommandNamespace(name) {
  this.name = name;
  this.actions = {};

  this.addAction = function(action) {
    this.actions[action.name] = action;

    this[action.name] = action.run.bind(action);
  }
}

function CommandAction(command) {
  extend(this, command);

  this.name = this.action;

  var requiredOptions = this.options.required;
  var optionalOptions = this.options.optional;

  this.run = function(userOptions) {
    if (!userOptions) {
      userOptions = {};
    }

    requiredOptions.forEach(function(option) {
      if(userOptions[option.key] === undefined) {
        throw new Error("Need to supply option " + option.key);
      }

      var userValue = userOptions[option.key];
      if (option.values) {
        // check that the user supplied valid value
        if (option.values.indexOf(userValue) === -1) {
          throw new Error("Need to supply valid option for " + option.key);
        }
      }
    });

    if (this.name === "create") {
      var appTypePrefix = userOptions.category.substring(0, 4);
      if (userOptions.app_type === "GAME" && appTypePrefix !== "GAME") {
        throw new Error("Need to supply valid category for app_type GAME");
      }

      if (userOptions.app_type !== "GAME" && appTypePrefix === "GAME") {
        throw new Error("Need to supply valid category for app_type APPLICATION");
      }

      //default values assigned -> move this to create only
      optionalOptions.forEach(function(option) {
        if (userOptions[option.key] === undefined){
          userOptions[option.key] = option.default;
        }
      });
    }
    
    //add the checking for the various education ones -> if there is the first one, should have the other ones too

    // run the actual script

    ScriptRunner.run(this.namespace, this.name, userOptions);
  }
}

_commands.forEach(function(command) {
  var namespaceName = command.namespace;
  var namespace = Namespaces[namespaceName];
  if (!namespace) {
    namespace = new CommandNamespace(namespaceName);
    Namespaces[namespaceName] = namespace;
  }

  var action = extend(new CommandAction(command));
  namespace.addAction(action);
});

exports = module.exports = Namespaces;

// PlayBot.app.create({title: "thing"});
