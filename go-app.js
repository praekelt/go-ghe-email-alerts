// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

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

go.utils = function () {
  var _ = require('lodash');
  var vumigo = require('vumigo_v02');
  var HttpApi = vumigo.http.api.HttpApi;

  function format_address(address) {
    if (isNoU(address) || address.length === 0) {
      return '';
    }

    var len = address.length;
    var last_4_digits = address.slice(-4, len);
    return (len > 4 ? Array(len - 3).join('*') : '') + last_4_digits;
  }

  function send_email(email_config, usr_addr, im) {
    var options = {
      headers: {
        'Authorization': 'Bearer ' + email_config.api_key,
        'Content-Type': 'application/json'
      }
    };

    var body = {
      "personalizations": [{
        "to": [{
          "email": email_config.to
        }],
        "subject": email_config.subject,
        "substitutions": {
          ":user_address:": usr_addr,
          ":message:": im.msg.content
        }
      }],
      "from": {
        "email": email_config.from,
        "name": email_config.from_name
      },
      "template_id": email_config.template
    };

    var api = new HttpApi(im, options);

    return api.post('https://api.sendgrid.com/v3/mail/send', {
        body: body
      })
      .then(function (response) {
        return im.log(response).thenResolve(true);
      }).catch(function (err) {
        return im.log(err).thenResolve(false);
      });
  }

  function process_keywords(msg, keywords) {
    var usr_msg = msg.content;
    var found = false;

    if (
      isNoU(usr_msg) ||
      isNoU(keywords) ||
      !_.isArray(keywords) ||
      (_.isArray(keywords) && keywords.length === 0)
    ) {
      return;
    }

    _.each(keywords, function (keyword) {
      var rx = new RegExp('^' + keyword + '\\s|\\s' + keyword + '$|\\s' + keyword + '\\s', 'i');
      var m = rx.exec(usr_msg);
      if (!_.isNull(m)) {
        found = true;
        return false;
      }
    });

    return found;
  }

  function isNoU(value) {
    return _.isNull(value) || _.isUndefined(value);
  }

  return {
    format_address: format_address,
    send_email: send_email,
    process_keywords: process_keywords,
    isNoU: isNoU
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
