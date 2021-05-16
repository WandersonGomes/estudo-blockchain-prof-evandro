const Comments = artifacts.require('Comments')
module.exports = function(deployer) {
  deployer.deploy(Comments);
};
