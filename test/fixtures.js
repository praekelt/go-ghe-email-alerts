module.exports = function () {
  return [{
    request: {
      method: "POST",
      url: "https://api.sendgrid.com/v3/mail/send",
      headers: {
        'Authorization': 'Bearer 12341234134'
      },
      data: {
        personalizations: [{
          to: [{
            email: 'test@test.net'
          }],
          subject: 'keyword detected',
          substitutions: {
            ':user_address:': '********6789',
            ':message:': 'test this sms out'
          }
        }],
        from: {
          email: 'test@test.net',
          name: 'test'
        },
        template_id: '23492304902934',
        content: [{
          type: 'text/html',
          value: 'test'
        }]
      },
      response: {
        code: 200,
        data: {}
      }
    }
  }];
};
