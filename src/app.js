go.app = function () {
  var vumigo = require('vumigo_v02');
  var App = vumigo.App;
  var EndState = vumigo.states.EndState;
  var Q = require('q');

  var GoApp = App.extend(function (self) {
    App.call(self, 'states:start');

    self.states.add('states:start', function (name) {
      var config = self.im.config;
      var found = go.utils.process_keywords(self.im.msg, config.keywords);
      var usr_addr = go.utils.format_address(self.im.msg.from_addr);
      var state = new EndState(name, {
        text: config.welcome_message,
        next: 'states:start'
      });

      return Q.promise(function (resolve, reject) {
        if (found) {
          return go.utils.send_email(config.email_config, usr_addr, self.im)
            .then(function () {
              return resolve(state);
            });
        } else {
          return resolve(state);
        }
      });
    });
  });

  return {
    GoApp: GoApp
  };
}();
