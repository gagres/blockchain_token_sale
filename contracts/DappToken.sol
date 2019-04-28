pragma solidity ^0.4.2;

// ERC 20 Token format

contract DappToken {
    string public name = 'Dapp Token';
    string public symbol = 'DAPP';
    string public standard = 'Dapp Token v1.0';
    uint256 public totalSupply;
    
    // Transfer event
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // Approve event
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );


    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public {
        // allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // Delegated functions
    // msg.sender approve an account __spender to send _value tokens
    function approve(address _spender, uint256 _value) public returns (bool success) {
        // Handle the allowance
        allowance[msg.sender][_spender] = _value;

        // Must trigger approve event
        emit Approval(msg.sender, _spender, _value);
        
        
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // Require from account has enough tokens
        require(_value <= balanceOf[_from]);
        // Require allowance is big enough
        require(_value <= allowance[_from][msg.sender]);
        // Change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // Update the allowance
        allowance[_from][msg.sender] -= _value;

        // Tranfer event
        emit Transfer(_from, _to, _value);

        // Returns bool
        return true;
    }
}