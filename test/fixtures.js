module.exports = function () {
  return [{
    request: {
      method: "POST",
      url: "https://api.sendgrid.com/v3/mail/send",
      headers: {
        'Authorization': 'Bearer 12341234134',
        'Content-Type': 'application/json'
      },
      data: {
        personalizations: [{
          to: [{
            email: 'test@test.net'
          }],
          subject: 'keyword detected'
        }],
        from: {
          email: 'test@test.net',
          name: 'test'
        },
        template_id: '23492304902934',
        custom_args: {
          user_address: '********6789'
        }
      },
      response: {
        code: 200,
        data: {}
      }
    }
  }];
};
