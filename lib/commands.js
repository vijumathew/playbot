var _commands = require('./_commands.json').commands;
var extend = require('util')._extend;

var ScriptRunner = require('./script_runner');

var credentials = {};
var Namespaces = {
  set_credentials: function(creds) {
    credentials = creds;
  },
  with_credentials: function(creds, callback) {
    credentials = creds;
    callback();
    credentials = {};
  }
};

function CommandNamespace(name) {
  this.name = name;
  this.actions = {};

  this.addAction = function(action) {
    this.actions[action.name] = action;

    this[action.name] = action.run.bind(action);
  }
}

function CommandOption(option) {
  extend(this, option);

  this.cliDescription = function() {
    var s = "";

    if (this.required) s += "REQUIRED ";
    s += this.description;
    if (this.values) s += (" - VALUES: " + this.values);
    if (this.default) s += (" - DEFAULT: " + this.default);

    return s;
  }
}

function CommandAction(command) {
  extend(this, command);

  this.name = this.action;

  var options = {
    required: this.options.required,
    optional: this.options.optional
  };
  for (var optionType in options) {
    options[optionType] = options[optionType].map(function(option) {
      return new CommandOption(option);
    });
  }
  this.options = options;

  var requiredOptions = this.options.required;
  var optionalOptions = this.options.optional;

  this.cliCommand = function() {
    return this.namespace + ":" + this.name;
  }

  this.run = function(userOptions, callback) {
    if (!userOptions) {
      userOptions = {};
    }

    extend(userOptions, credentials);

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

      optionalOptions.forEach(function(option) {
        if (userOptions[option.key] === undefined){
          userOptions[option.key] = option.default;
        }
      });
    }

    // run the actual script
    ScriptRunner.run(this.namespace, this.name, userOptions, callback);
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