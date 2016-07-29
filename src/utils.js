go.utils = function () {
  var _ = require('lodash');
  var vumigo = require('vumigo_v02');
  var JsonApi = vumigo.http.api.JsonApi;

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
        Authorization: [
          ['Bearer ', email_config.api_key].join('')
        ]
      }
    };

    var body = {
      personalizations: [{
        to: [{
          email: email_config.to
        }],
        subject: email_config.subject,
        substitutions: {
          ':user_address:': usr_addr,
          ':message:': im.msg.content
        }
      }],
      from: {
        email: email_config.from,
        name: email_config.from_name
      },
      template_id: email_config.template,
      content: [{
        type: 'text/html',
        value: 'test'
      }]
    };

    var api = new JsonApi(im, options);

    return api.post('https://api.sendgrid.com/v3/mail/send', {
        data: body
      })
      .then(function (response) {
        return im.log.info('post to sendgrid was succesful').thenResolve(true);
      }).catch(function (err) {
        return im.log.error([
          'post to sendgrid failed. Reason: ',
          JSON.stringify(err)
        ].join(' ')).thenResolve(false);
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
