var wreck = require('wreck');
var npm = require('npm-publish-stream');
var settings = {
  useFilter: true,
  startTime: new Date(Date.now() - 60 * 1000 * 10), //new Date()
  hook: 'https://hooks.slack.com/services/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',
  npmPackageLink: 'https://www.npmjs.org/package/{module}',
  filterList: ['accept', 'ammo', 'b64', 'bassmaster', 'bell', 'boom', 'bossy', 'call', 'catbox', 'catbox-memcached', 'catbox-memory', 'catbox-mongodb', 'code', 'confidence', 'content', 'crumb', 'cryptiles', 'faketoe', 'glue', 'good', 'good-broadcast', 'good-console', 'good-file', 'good-http', 'good-reporter', 'good-udp', 'h2o2', 'hapi', 'hapi-auth-basic', 'hapi-auth-cookie', 'hapi-auth-hawk', 'heavy', 'hoek', 'inert', 'items', 'joi', 'kilt', 'lab', 'lout', 'mimos', 'nigel', 'peekaboo', 'pez', 'poop', 'qs', 'rejoice', 'reptile', 'scooter', 'shot', 'statehood', 'subtext', 'topo', 'tv', 'vise', 'vision', 'visionary', 'wreck', 'yar']
};

var stream = new npm({ startTime: settings.startTime });

stream.on('error', console.error);

stream.on('data', function(data) {
  var module = data.id;

  if (settings.useFilter && settings.filterList.indexOf(module) === -1) {
    return;
  }

  var version = data.doc['dist-tags'].latest;
  var packageLink = settings.npmPackageLink.replace('{module}', module);
  var txt = 'Published <' + packageLink + '|' + module + '@' + version + '>';
  var payload = {
    payload: JSON.stringify({
      username: 'hapijs-bot',
      icon_emoji: ':hapi:',
      text: txt
    })
  };

  wreck.post(settings.hook, payload, function(err, res, payload) {
    console.log(txt);

    if (err) {
      return console.error(err);
    }

    if (res.statusCode !== 200) {
      return console.error(payload);
    }
  });
});
