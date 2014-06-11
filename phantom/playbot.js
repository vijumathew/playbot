/* playbot.js */

var require = patchRequire(require);
var fs = require('fs');
var Casper = require('casper');

var iterate = function(object, callback) {
    var keys = Object.keys(object);
    for (var i = keys.length - 1; i >= 0; i--) {
        var key = keys[i];
        var value = object[key];
        callback(key, value);
    }
};

var merge = function(obj1,obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
};

var isFunction = function(obj) {
    return typeof(obj) === 'function';
};

var isUndefined = function(obj) {
    return obj === void(0);
};

var $outputFormat;
var jsonLog = function(obj) {
    console.log(JSON.stringify(obj));
};
console.formatLog = function(string, json) {
    if ($outputFormat === 'json') {
        jsonLog(merge({normal_output: string}, json));
    }
    else if (string.length > 0) {
        console.log(string);
    }
};

var die = function(page, message, metadata) {
    if (isUndefined(metadata)) {
        metadata = {};
    }
    console.formatLog("", {event: "debug_html", html: page.getHTML()});
    //var error = merge({event: "error", message: message}, metadata);
    //console.formatLog("☠ " + message, error);
    page.die("☠ " + message, 1);
};

var dieFromException = function(page, ex, metadata) {
    if (isUndefined(metadata)) {
        metadata = {};
    }
    metadata.stack = ex.stack;
    die(page, ex.message, metadata);
};

var Shortcuts = {
    safeFillSelectors: function(page, formSelector, fillOptions, doSubmission) {
        if (doSubmission === undefined) {
            doSubmission = true;
        }
        var safeOptions = {};

        iterate(fillOptions, function(selector, value) {
            if (page.exists(selector)) {
                safeOptions[selector] = value;
            }
        });

        page.fillSelectors(formSelector, safeOptions, doSubmission);
    },
    safeFill: function(page, formSelector, fillOptions, doSubmission) {
        var transformedFillOptions = {};


        iterate(fillOptions, function(fieldName, value) {
            transformedFillOptions['[name="' + fieldName + '"]'] = value;
        });


        Shortcuts.safeFillSelectors(page, formSelector, transformedFillOptions, doSubmission);
    }
};

function PlayBot(options) {
    var _username, _password;
    var playbot = this;
    var _currentPage;
    var _actions = {};
    var _steps = [];

    if (!isUndefined(options.username)) {
        _username = options.username;
    }
    if (!isUndefined(options.password)) {
        _password = options.password;
    }
    if (!isUndefined(options.output_format)) {
        $outputFormat = options.output_format;
    }

    var logStepStart = function(stepName) {
        console.formatLog("- " + stepName, {event: "step_start", name: stepName});
    };
    var logStepComplete = function(stepName) {
        console.formatLog("✔ " + stepName, {event: "step_complete", name: stepName});
    };
    var logActionStart = function(actionName) {
        console.formatLog("- " + actionName, {event: "action_start", name: actionName});
    };
    var logActionComplete = function(actionName) {
        console.formatLog("✔ " + actionName, {event: "action_complete", name: actionName});
    };
    var logStepFail = function(stepName) {
        console.formatLog("! " + actionName, {event: "step_fail", name: stepName});
    };
    var logPageError = function(error) {
        console.formatLog("X - " + errors[i], {event: "page_error", error: error});
    };

    this.result = function(result) {
        jsonLog({'result': result});
    };

    var createPage = function() {
        var page = Casper.create({
            verbose: true,
            logLevel: 'warning',
            //logLevel: 'info',
            waitTimeout: 10000
        });
        page.echo = function(string, style) {
            console.formatLog(string, {message: string, event: "echo"});
            return page;
        };

        phantom.cookiesEnabled = true;
        page.userAgent('Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7');
        return page;
    };

    this.openPage = function(url, callback) {
        var page = createPage();

        logStepStart("Wait for the login URL");
        page.start(url, function() {
            logStepComplete("Wait for the login URL");
            logActionStart("Fill the login form");
            try {
                Shortcuts.safeFill(page, 'form', {
                    'theAccountName': _username,
                    'theAccountPW': _password,
                    'appleId': _username,
                    'accountPassword': _password
                }, true);
            }
            catch (ex) {
                dieFromException(page, ex);
            }
        });
        page.then(function(response) {
            logActionComplete("Fill the login form");

            logStepStart("Wait for the login to process");
            if (page.exists('.dserror')) {
                die(page, "Login error: " + page.getHTML('.dserror'));
            }
            logStepComplete("Wait for the login to process");
            logActionStart("Open the action URL (" + url + ")");
        });
        page.thenOpen(url, function() {
            logActionComplete("Wait for the action URL to load");
            callback(page);
        });

        page.run();

        this.setPage(page);
    };

    this.shortcuts = Shortcuts;

    var addAction = function(actionName, actionImpl) {
        _actions[actionName] = actionImpl;
    };

    var runAction = function(actionName) {
        var action = _actions[actionName];
        if (action) {
            logActionStart(actionName);
            try {
                action();
                logActionComplete(actionName);
            } catch (ex) {
                dieFromException(_currentPage, ex, {action: actionName});
            }
        }
        else {
            die(_currentPage, "Could not find registered action for '" + actionName + "'");
        }
    };

    this.action = function(actionName, actionImpl) {
        if (isUndefined(actionImpl)) {
            runAction(actionName);
        }
        else {
            addAction(actionName, actionImpl);
        }
    };

    var logPageErrors = function() {
        _currentPage.debugHTML();

        var errors = _currentPage.evaluate(function() {
            var errors = [];
            var errorEls = document.querySelectorAll(".global-message.error li span");
            for (var i = 0; i < errorEls.length; i++) {
                errors.push(errorEls[i].innerHTML);
            }
            return errors;
        });
        for (var i = 0; i < errors.length; i++) {
            logPageError(errors[i]);
        }
    };

    this.step = function(stepName, methodName, methodArg, callback, options) {
        var _step = {
            name: stepName,
            methodName: methodName,
            methodArg: methodArg,
            methodDescription: function() {
                var argDescription = "'" + _step.methodArg + "'";
                if (isFunction(_step.methodArg)) {
                    argDescription = "[function]";
                }
                return  _step.name + " ( " + _step.methodName + "(" + argDescription + ")" + " )";
            },
            callback: callback,
            options: options || {}
        }
        var method = _currentPage[_step.methodName];
        var timeout = undefined;
        if (_step.options.timeout) {
            timeout = _step.options.timeout;
        }
        method.bind(_currentPage)(_step.methodArg, function() {
            logStepComplete(_step.name);
            if (isFunction(_step.callback)) {
                _step.callback();
            }
        }, function() {
            logStepFail(_step.name);
            var userDieMethod = _step.options.onFail;
            if (isFunction(_step.options)) {
                userDieMethod = _step.options;
            }
            var shouldDie = true;
            if (userDieMethod) {
                shouldDie = (userDieMethod() !== false);
            }
            if (shouldDie === true) {
                logPageErrors();
                die(_currentPage, "Failed @ " + _step.methodDescription(), {step: _step.name});
            }
        }, timeout);
    }

    this.setPage = function(page) {
        _currentPage = page;
    }
};

var getOptionsWithManifest = function() {
    var casper = require("casper").create();
    var options = casper.cli.options;

    var manifest = options.manifest;
    if (manifest) {
        var f = fs.open(manifest, "r");
        options = JSON.parse(f.read());
    }

    return options;
}

var _commandConfigs = null;
var CommandConfigs = function() {
    if (_commandConfigs === null) {
        var options = getOptionsWithManifest();
        // no __FILE__ equivalent in phantomjs, unfortunately
        var playbotRootPath = options.playbot_root_path || "./";
        var _commandsFilePath = playbotRootPath + fs.separator + 'phantom' + fs.separator + '_commands.json';
        _commandConfigs = JSON.parse(fs.open(_commandsFilePath, "r").read());
    }
    return _commandConfigs;
}

function CommandHandler(fileName) {

    var _fullOptions = CommandConfigs()[fileName];
    var _options = {};
    _options.options = {
        required: [],
        optional: []
    };

    var optionToString = function(optionData) {
        return optionData.key;
    };
    var parseOption = function(optionData) {
        if (optionData.batch) {
            return optionData.keys;
        }
        else {
            return optionToString(optionData);
        }
    };
    var parseOptions = function(optionList) {
        var _optionList = [];
        for (var i = optionList.length - 1; i >= 0; i--) {
            var parsed = parseOption(optionList[i]);
            if (parsed instanceof Array) {
                _optionList = _optionList.concat(parsed);
            }
            else {
                _optionList.push(parsed);
            }
        };
        return _optionList;
    };

    if (_fullOptions.options.required) {
        _options.options.required = parseOptions(_fullOptions.options.required);
    }
    if (_fullOptions.options.optional) {
        _options.options.optional = parseOptions(_fullOptions.options.optional);
    }

    var _description = _options.description;
    var _requiredCommands = _options.options.required;
    var _optionalCommands = _options.options.optional;
    var ARG_OFFSET = 1;

    this.description = function() {
        var requiredString = _requiredCommands.map(function(c) {
            return "<" + c + ">";
        }).join(" ");
        var optionalString = _optionalCommands.map(function(c) {
            return "--" + c  + "=<" + c + ">";
        }).join(" ");
        return _description + ": " + requiredString + " " + optionalString;
    }

    this.parseArgs = function() {
        var casper = require("casper").create();

        var givenOptions = {};
        var requiredValues = casper.cli.args || [];
        var allButRequired = getOptionsWithManifest();

        for (var i = 0; i < _requiredCommands.length; i++) {
            var key = _requiredCommands[i];
            if (allButRequired[key]) {
                requiredValues.push(allButRequired[key]);
            }
        }

        if (requiredValues.length != _requiredCommands.length) {
            var message = "Incomplete arguments - need to include " + _requiredCommands;
            throw message;
        }

        for (var i = 0; i < _requiredCommands.length; i++) {
            var key = _requiredCommands[i];
            givenOptions[key] = requiredValues[i];
        }

        for (var i = 0; i < _optionalCommands.length; i++) {
            var key = _optionalCommands[i];
            givenOptions[key] = allButRequired[key];
        }

        return givenOptions;
    };

    this.getAuthFromArgs = function() {
        var options = getOptionsWithManifest();

        return {
            username: options.username,
            password: options.password,
            output_format: options.output_format
        };
    }
}

exports.PlayBot = PlayBot;
exports.CommandHandler = CommandHandler;
