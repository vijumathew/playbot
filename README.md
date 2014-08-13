# PlayBot - The Google Play Robot

A CLI and JavaScript library to manage Google Play tasks. Uses [Selenium](http://docs.seleniumhq.org/) for easy maintenance and flexibility.

## Requirements

PlayBot requires [NodeJS](http://nodejs.org/).

## Installation

```
$ npm install playbot
# or
$ npm install playbot -g
```

## Usage

### Commands

- `app:create` - Creates an entry for a new app on Google Play
- `app:update` - Updates an existing entry for an app on Google Play
- `app:delete` - Deletes an existing entry for an app on Google Play
- `app:publish` - Publishes an existing entry for an app on Google Play
- `app:unpublish` - Unpublishes an existing entry for an app on Google Play
- `app:list` - Lists existing app entries on Google Play Dev Console

#### JSON Manifests

Most commands take in options - you can either pass them individually, or use a JSON manifest file like this:

```json
{
    "title": "My new app",
    "subtext": "This app is really awesome!"
}
```

For example, the following commands are equivalent usng this JSON manifest:

```shell
$ playbot app:create --title 'My new app' --subtext 'This app is really awesome!'
$ playbot app:create --manifest ./manifest.json
```

```javascript
// JavaScript
PlayBot.app.create({title: "My new app", subtext: "This app is really awesome!"});
PlayBot.app.create({manifest: "./manifest.json"});
```

### CLI

PlayBot installs an `playbot` command, which you can explore with `-h` flags:

```shell
$ playbot -h

  Commands:
    app:create           Create App
    app:update           Update App
    app:delete           Delete App
    app:publish          Publish App
    app:unpublish        Unpublish App
    app:list             List Apps
    help                 Display global or [command] help documentation.

  Global Options:
    --manifest FILE.json Use a JSON file to load options for each command
    --username USERNAME  Username to login to Google Play, or $PLAYBOT_USERNAME
    --password PASSWORD  Password to login to Google Play, or $PLAYBOT_PASSWORD
    --format FORMAT      Output format - ['json', 'pretty']
    --verbose            Verbose output
```

#### Authentication

For every command, you can pass `--username` and `--password` flags to enter you auth credentials; you can also set `$PLAYBOT_USERNAME` and `$PLAYBOT_PASSWORD` environment variables.

### JavaScript/Node

The Node package uses a `PlayBot` object, and its properties map to the CLI commands:

```javascript
var PlayBot = require('playbot');
PlayBot.app.create({options: here});
```

#### Authentication

The JavaScript library has a few shortcuts for logging in to Google Play:

```javascript
// pass as options
PlayBot.app.create({username: "username", password: "password"});

// run in closure
PlayBot.with_credentials({username: "username", password: "password"}, function() {
  PlayBot.app.create(options);
});

// set globally
PlayBot.set_credentials({username: "username", password: "password"});
```


### Output

The `:list` commands are meant to return some data. If you're using the JavaScript library, you'll receive an `Array` when the command is done; if you're using the CLI, the command will output a JSON object with one entry.

```javascript
PlayBot.app.list({options}, function(err, res) {
  // res = ["com.usepropeller.myapp"]
});
```

```bash
$ playbot app:list
{"apps": ["com.usepropeller.myapp"]}
```

If you're using any other command (which generally create side-effects), the end result will be `true` in Javascript, or exit code 0 on the CLI.

#### Verbose & Pretty Output

You can base a `--verbose` flag (or a `verbose: true` option in JavaScript) to see all of the output as each script processes. There are two output formats, `json` and `pretty`, which you are set with either the `--format` flag or `format: 'format_string'` options in JavaScript.

## Contact

[Viju Mathew](https://github.com/vijumathew)
- [viju.jm@gmail.com](mailto:viju.jm@gmail.com)

[Clay Allsopp](http://clayallsopp.com/)
- [clay@usepropeller.com](mailto:clay@usepropeller.com)
- [@clayallsopp](https://twitter.com/clayallsopp)

## License

PlayBot is available under the MIT license. See the [LICENSE](LICENSE) file for more info.
