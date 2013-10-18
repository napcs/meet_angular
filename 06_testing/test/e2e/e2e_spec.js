describe("Integration/E2E Testing", function() {

  // start at root before every test is run
  beforeEach(function() {
    browser().navigateTo('/');
  });

  it("can load photos when searched", function(){
    input("keyword").enter("red");
    element("input[type=submit]").click();
    expect(element('#results').html()).toContain('Red');
  });

});
