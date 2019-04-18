const DappToken = artifacts.require('./DappToken.sol');

contract('DappToken', function(accounts) {
    it('sets the total supply upon deployment', function() {
        return DappToken.deployed()
            .then((tokenInstance) => tokenInstance.totalSupply())
            .then((totalSupply) => {
                assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
            })
    });
});