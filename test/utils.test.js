require('should');

describe('utils', function () {
  describe('format_address', function () {
    it('should format the user address correctly', function () {
      go.utils.format_address('+1234657890').should.eql('*******7890');
      go.utils.format_address('+1234').should.eql('*1234');
      go.utils.format_address('+123').should.eql('+123');
      go.utils.format_address('test@test.net').should.eql('*********.net');
    });
  });

  describe('isNoU', function () {
    it('should detect nulls and undefines', function () {
      var test_obj = {};
      go.utils.isNoU(null).should.eql(true);
      go.utils.isNoU(test_obj).should.eql(false);
      go.utils.isNoU(test_obj.value).should.eql(true);
    });
  });

  describe('process_keywords', function () {
    it('should return false when keyword is not found', function () {
      var msg = {
        content: 'hi'
      };
      var keywords = ['test', 'test1'];

      go.utils.process_keywords(msg, keywords).should.eql(false);
    });

    it('should not match partial worlds', function () {
      var msg = {
        content: 'testing tester'
      };

      var keywords = ['test', 'test1'];

      go.utils.process_keywords(msg, keywords).should.eql(false);
    });

    it('should match whole worlds', function () {
      var msg = {
        content: 'testing tester'
      };

      var keywords = ['test', 'test1', 'tester'];

      go.utils.process_keywords(msg, keywords).should.eql(true);
    });

    it('should match whole worlds ignoring case', function () {
      var msg = {
        content: 'testing TeStEr'
      };

      var keywords = ['test', 'test1', 'tEstEr'];

      go.utils.process_keywords(msg, keywords).should.eql(true);
    });

    it('should match whole worlds in the begining of the message', function () {
      var msg = {
        content: 'tester testing'
      };

      var keywords = ['test', 'test1', 'tester'];

      go.utils.process_keywords(msg, keywords).should.eql(true);
    });

    it('should match whole worlds in the middle of the message', function () {
      var msg = {
        content: 'tester testing'
      };

      var keywords = ['test', 'test1', 'tester'];

      go.utils.process_keywords(msg, keywords).should.eql(true);
    });
  });
});
