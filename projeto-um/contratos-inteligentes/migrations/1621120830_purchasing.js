const Purchasing = artifacts.require('Purchasing')

module.exports = function(deployer) {
    deployer.deploy(Purchasing);
};
