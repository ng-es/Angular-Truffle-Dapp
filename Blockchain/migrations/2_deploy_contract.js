const Payment = artifacts.require("Payment");

module.exports = function(deployer) {
  deployer.deploy(Payment);
};
