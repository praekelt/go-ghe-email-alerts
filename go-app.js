// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

go.app = function () {
  var vumigo = require('vumigo_v02');
  var App = vumigo.App;
  var EndState = vumigo.states.EndState;
  var utils = require('./utils');
  var Q = require('q');

  var GoApp = App.extend(function (self) {
    App.call(self, 'states:start');

    self.states.add('states:start', function (name) {
      var config = self.im.config;
      var found = utils.process_keywords(self.im.msg, config.keywords);
      var usr_addr = utils.format_address(self.im.msg.from_addr);
      var state = new EndState(name, {
        text: config.welcome_message,
        next: 'states:start'
      });

      return Q.promise(function (resolve, reject) {
        if (found) {
          return utils.send_email(config.email_config, usr_addr, self.im)
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

go.init = function () {
  var vumigo = require('vumigo_v02');
  var InteractionMachine = vumigo.InteractionMachine;
  var GoApp = go.app.GoApp;


  return {
    im: new InteractionMachine(api, new GoApp())
  };
}();
