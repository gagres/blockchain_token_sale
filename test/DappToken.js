const DappToken = artifacts.require('./DappToken.sol');

contract('DappToken', function(accounts) {

    it('initializes the contract', function() {
        return DappToken.deployed()
            .then((instance) => {
                tokenInstance = instance;
                return instance.name();
            })
            .then((name) => {
                assert.equal(name, 'Dapp Token', 'has correct name');
                return tokenInstance.symbol();
            })
            .then((symbol) => {
                assert.equal(symbol, 'DAPP', 'has correct symbol');
                return tokenInstance.standard();
            })
            .then((standard) => {
                assert.equal(standard, 'Dapp Token v1.0', 'has the correct standard');
            })
    });

    it('allocates the initial supply upon deployment', function() {
        let tokenInstance;
        return DappToken.deployed()
            .then((instance) => {
                tokenInstance = instance;
                return instance.totalSupply();
            })
            .then((totalSupply) => {
                assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
                return tokenInstance.balanceOf(accounts[0])
            })
            .then((adminBalance) => {
                assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
            })
    });

    it('transfer token ownership', function() {
        let tokenInstance;
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return instance.transfer.call(accounts[0], 999999999999);
        })
        .then(assert.fail).catch(function(err) {
            assert(err.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        })
        .then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        })
        .then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the transfer event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transferred amount');
            return tokenInstance.balanceOf(accounts[1]);
        })
        .then(function(balance) {
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0]);
        })
        .then(function(balance) {
            assert.equal(balance.toNumber(), 750000, 'deducts amount from the sending account');
        })
    });
});