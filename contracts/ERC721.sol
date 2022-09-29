//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./interfaces/IERC721TokenReceiver.sol";
import "hardhat/console.sol";


 /// @notice This contact follows the standard for ERC-721 non fungible tokens
 /// @dev Comment follow the Ethereum ´Natural Specification´ language format (´natspec´)
 /// Referencia: https://docs.soliditylang.org/en/v0.8.16/natspec-format.html  
contract ERC721 {

    /// STATE VARIABLES
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public tokenIndex;

    /// STATE MAPPINGS
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => bool) private tokenID;

    /// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
    /// @dev URIs are defined in RFC 3986. The URI may point to a JSON file 
    /// that conforms to the "ERC721 Metadata JSON Schema".
    mapping(uint256 => string) public tokenURI;
    mapping(uint256 => address) public approved;
    mapping(address => mapping(address => bool)) public operator;    

    /// EVENTS
    /// @notice Trigger when NFTs are transferred, created (`from` == 0) and destroyed
    ///  (`to` == 0). Exception: during contract creation.
    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);

    /// @notice Trigger on any successful call to `approve` method. When approved address for
    /// an NFT is changed or reaffirmed
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

    /// @notice Trigger when an operator is enabled or disabled for an owner.
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    /**
     * @notice Initialize the state of the contract
     * @dev Throw if `_name` is empty. Message: "constructor - Invalid parameter: _name"
     * @dev Throw if `_symbol` is empty. Message: "constructor - Invalid parameter: _symbol"
     * @param _name The name of the NFT collection
     * @param _symbol The symbol of the NFT collection
     */
    constructor(string memory _name, string memory _symbol) {
        string memory _methodName = 'constructor';
        _isEmptyString(_name, _methodName, '_name');
        _isEmptyString(_symbol, _methodName, '_symbol');
        name = _name;
        symbol = _symbol;
    }

    /// EXTERNAL FUNCTIONS

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws if `msg.sender` is not the current owner, an authorized operator, 
    /// or the approved address for the NFT. Message: "safeTransferFrom - Not authorized"
    /// @dev Throws if `_to` is not capable of receiving NFTs. Message: 
    /// "safeTransferFrom - Not capable of receiving NFTs"
    /// @dev Throw if `_from` is zero address. Message: "safeTransferFrom - Invalid parameter: _from"
    /// @dev Throw if `_to` is zero address. Message: "safeTransferFrom - Invalid parameter: _to"
    /// @dev Throw if `_tokenId` is invalid, AKA less then totalSupply. Message: 
    /// "safeTransferFrom - Invalid parameter: _tokenId"
    /// @param _from The address of the current owner of the NFT
    /// @param _to The address of the new owner of the NFT
    /// @param _tokenId The token identifier of the NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {
        string memory _methodName = 'safeTransferFrom';
        _isZeroAddress(_from, _methodName, '_from');
        _isZeroAddress(_to, _methodName, '_to');
        _isValidTokenId(_tokenId, _methodName, '_tokenId');
        _isAuthorized(_from, msg.sender, _tokenId, _methodName);

        balanceOf[_from] -= 1;
        balanceOf[_to] += 1;
        approved[_tokenId] = _to;
        ownerOf[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);

        _isERC721TokenReceiver(_to, _tokenId, _methodName);
    }

    /// @notice Change or reaffirm the approved address for an NFT. An approved address can operate an NFT as
    /// if was the owner.
    /// @dev Set to zero address to indicates that there is no approved address
    /// @dev Throw if msg.sender is not the current owner, an authorized operator, 
    /// or the approved address for the NFT. Message: "approve - Not authorized"
    /// @dev Throw if `_approved` is zero address. Message: "approve - Invalid parameter: _approved"
    /// @dev Throw if `_tokenId` is invalid, AKA less then totalSupply. Message: 
    /// "approve - Invalid parameter: _tokenId"
    /// @param _approved The address of the new approved NFT controller
    /// @param _tokenId The token identifier to approve
    function approve(address _approved, uint256 _tokenId) external {
        string memory _methodName = 'approve';
        _isZeroAddress(_approved, _methodName, '_approved');
        _isValidTokenId(_tokenId, _methodName, '_tokenId');
        _isAuthorized(msg.sender, _approved, _tokenId, _methodName);

        approved[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    /// @notice Enable or disable approval for a third party "operator" to manage
    ///  all of `msg.sender`'s assets
    /// @dev The contract MUST allow multiple operators per owner
    /// @dev Throw if msg.sender is not the current owner or an authorized operator. 
    /// @dev Message: "setApprovalForAll - Not authorized"
    /// @dev Throw if `_operator` is zero address. Message: "setApprovalForAll - Invalid parameter: _operator"
    /// @dev If operation is revoking approval free space from storage
    /// @param _operator The address to add as a new NFT authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external {
        string memory _methodName = 'setApprovalForAll';
        _isZeroAddress(_operator, _methodName, '_operator');

        if (_approved) {
            operator[msg.sender][_operator] = true;
        }
        else {
            delete operator[msg.sender][_operator]; // Free space
        }
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /**
     * @notice Issues a new NFT in exchange for ethers at a parity of 1 NFT for 2 ethers
     * @dev Throw if msg.value is less then 2 ethers. Message: "mint - Invalid ether amount"
     * @dev Throw if `_recipient` is zero address. Message: "mint - Invalid parameter: _recipient"
     * @dev Throw if `_uri` is empty. Message: mint - Invalid parameter: _uri"
     * @param _recipient It is the recipient account for the new NFT
     * @param _uri It is the uri for the new NFT
     */
    function mint(address _recipient, string memory _uri) external payable {
        string memory _methodName = 'mint';
        _isZeroAddress(_recipient, _methodName, '_recipient');
        _isEmptyString(_uri, _methodName, '_uri');
        if(msg.value < 2 ether){
            revert("mint - Invalid ether amount");
        }
        tokenID[tokenIndex] = true;
        ownerOf[tokenIndex] = _recipient;
        balanceOf[_recipient] += 1;
        tokenURI[tokenIndex] = _uri;
        emit Transfer(address(0), _recipient, tokenIndex);
        tokenIndex++;
        totalSupply++;
    }

    /**
     * @notice Returns ethers in exchange for burning an NFT at a parity of 1 NFT for 2 ether
     * @dev Throw if `_from` is zero address. Message: "burn - Invalid parameter: _from"
     * @dev Throw if msg.sender is not the current owner, an authorized operator, 
     * or the approved address for the NFT. Message: "burn - Not authorized"
     * @dev Throw if `_from` account is not the owner of ´_tokenId´. Message: "burn - Not the owner"
     * @param _from The address of the current owner of the NFT
     * @param _tokenId The token identifier to approve
     */
    function burn(address _from, uint256 _tokenId) external {
        string memory _methodName = 'burn';
        _isZeroAddress(_from, _methodName, '_from');
        _isAuthorized(_from, msg.sender, _tokenId, _methodName);
        if(ownerOf[_tokenId] != _from){
            revert("burn - Not the owner");
        }

        balanceOf[_from]--;
        delete tokenID[_tokenId];
        delete ownerOf[_tokenId];
        delete tokenURI[_tokenId];
        emit Transfer(_from, address(0), _tokenId);
        totalSupply--;
    }

    function _concatMessage(string memory _methodName, string memory _message, string memory _parameterName) private pure returns(string memory) {
        return string.concat(_methodName, _message, _parameterName);
    }

    function _isEmptyString(string memory _value, string memory _methodName, string memory _parameterName) private pure {
        if (bytes(_value).length == 0) {
            string memory _message = _concatMessage(_methodName, " - Invalid parameter: ", _parameterName);
            revert(_message);
        }
    }

    function _isZeroAddress(address _address, string memory _methodName, string memory _parameterName) private pure {
        if (_address == address(0)) {
            string memory _message = _concatMessage(_methodName, " - Invalid parameter: ", _parameterName);
            revert(_message);
        }
    }

    function _isAuthorized(address _owner, address _spender, uint256 _tokenId, string memory _methodName) private view {
        if (ownerOf[_tokenId] != _owner && operator[_owner][_spender] == false && approved[_tokenId] != _owner){
            string memory _message = _concatMessage(_methodName, " - Not authorized", "");
            revert(_message);
        }
    }

    /// @dev Throw if `_tokenId` is invalid, AKA less then totalSupply. Message: 
    /// "safeTransferFrom - Invalid parameter: _tokenId"
    function _isValidTokenId(uint256 _tokenId, string memory _methodName, string memory _parameterName) private view {
        if (_tokenId > totalSupply || tokenID[_tokenId] == false) {
            string memory _message = _concatMessage(_methodName, " - Invalid parameter: ", _parameterName);
            revert(_message);
        }
    }

    function _isERC721TokenReceiver(address _address, uint256 _tokenID, string memory _methodName) private {
        // Check if _address is a smart contract
        if (_isSmartContractAddress(_address)) {
            // This is the result of: bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))
            bytes4 ERC721_TokenReceiver_Hash = 0x150b7a02;
            bytes memory _data;
            bytes4 ERC721Received_result = IERC721TokenReceiver(_address).onERC721Received(_address, address(this), _tokenID, _data);
            
            // Check that support NFT
            if (ERC721Received_result != ERC721_TokenReceiver_Hash) {
                string memory _message = _concatMessage(_methodName, " - Not capable of receiving NFTs", "");
                revert(_message);
            }
        }
    }

    function _isSmartContractAddress(address _address) private view returns (bool) {
        bytes32 zeroAccountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        bytes32 codeHash;    
        assembly { codeHash := extcodehash(_address) }
        return (codeHash != zeroAccountHash && codeHash != 0x0);
    }
}