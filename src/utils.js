var _ = require('lodash');
var Q = require('q');
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
  return Q.promise(function (resolve, reject) {
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
        "subject": email_config.subject
      }],
      "from": {
        "email": email_config.from,
        "name": email_config.from_name
      },
      "template_id": email_config.template,
      "custom_args": {
        "user_address": usr_addr
      }
    };

    var api = new HttpApi(im, options);

    return api.post('https://api.sendgrid.com/v3/mail/send', {
        body: body
      })
      .then(function (response) {
        console.log(response);
        return resolve(true);
      }).catch(function (err) {
        consle.log(err);
      });
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

module.exports = {
  format_address: format_address,
  send_email: send_email,
  process_keywords: process_keywords,
  isNoU: isNoU
};
