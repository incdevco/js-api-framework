var base = process.env.PWD;

var Framework = require(+'/framework');

describe('Framework.Errors.NotAllowed',function () {

  it('should be instanceof Framework.Errors.NotAllowed',function () {

    var error = new Framework.Errors.NotAllowed('resource','privilege');

    Framework.Expect(error).to.be.instanceof(Framework.Errors.NotAllowed);

  });

});
