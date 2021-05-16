pragma solidity ^0.5.8;

contract Comments {
    event Comment(string asset, string comment);
    address public authority;

    constructor() public {
        authority = msg.sender;
    }

    function postComment(string memory asset, string memory comment) public {
        emit Comment(asset, comment);
    }
}
