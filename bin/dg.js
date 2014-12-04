#!/usr/bin/env node

var docopt = require('docopt').docopt,
    fs = require('fs'),
    r = require('request');

var doc = 'Usage: dg [options] GISTID...' +
    '\n' +
    '\nOptions:' +
    '\n  -c --config   Path to aliases config file.' +
    '\n  -a --alias    Grab Gist ID from an alias.' +
    '\n  -f --force    Replace already existing files with new Gist files.' +
    '\n  -h --help     Show this screen.' +
    '\n  -v --version  Output version.';
var cli = docopt(doc, { help: true, version: '0.4.0' });

var options = { headers: { 'User-Agent': 'request' } },
    parsedBody,
    curFile;

// get the Gists
cli.GISTID.forEach(function (val) {
    options.url = 'https://api.github.com/gists/' + val;

    r(options, function (err, res, body) {
        if (err) { return err; }
        parsedBody = JSON.parse(body);

        for (var file in parsedBody.files) {
            if (parsedBody.files.hasOwnProperty(file)) {
                curFile = parsedBody.files[file];

                console.log(curFile.filename);

                // TODO: add a check for if file exists

                fs.writeFile('./' + curFile.filename, curFile.content, function (err) {
                    if (err) { return err; }
                });
            }
        }
    });
});
