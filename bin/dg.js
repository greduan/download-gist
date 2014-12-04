#!/usr/bin/env node

var docopt = require('docopt').docopt,
    fs = require('fs'),
    r = require('request'),

    doc = 'Usage: dg [options] GISTID...' +
    '\n' +
    '\nOptions:' +
    '\n  -v --verbose  Output which files are being written.'
    '\n  -c --config   Path to aliases config file.' +
    '\n  -a --alias    Grab Gist ID from an alias.' +
    '\n  -f --force    Replace already existing files with new Gist files.' +
    '\n  -h --help     Show this screen.' +
    '\n  --version     Output version.',
    cli = docopt(doc, { help: true, version: '0.4.0' }),

    i,
    options = {
        headers: {
            'User-Agent': 'request'
        }
    },
    gists = [],
    curFile;

// get the Gists
cli.GISTID.forEach(function (val) {
    options.url = 'https://api.github.com/gists/' + val;

    r(options, function (err, res, body) {
        if (err) { return err; }
        gists.push(body.files);
    });
});

gists.forEach(function (files) {
    // if (cli['--verbose']) {
    //     // TODO: should output Gist ID
    // }

    for (var key in files) {
        if (files.hasOwnProperty(key)) {
            curFile = files[key];

            if (cli['--verbose']) {
                console.log(curFile.filename);
            }

            // TODO: add a check for if file exists

            fs.writeFile('./' + curFile.filename, curfile.content, function (err) {
                if (err) { return err; }
            });
        }
    }
});
