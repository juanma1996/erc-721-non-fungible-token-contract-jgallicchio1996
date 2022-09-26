//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

 /// @notice This contact follows the standard for ERC-721 non fungible tokens
 /// @dev Comment follow the Ethereum ´Natural Specification´ language format (´natspec´)
 /// Referencia: https://docs.soliditylang.org/en/v0.8.16/natspec-format.html  
contract ERC721 {

    /// STATE VARIABLES
    string public name;
    string public symbol;
    uint256 public totalSupply;

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
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    /// @notice Trigger on any successful call to `approve` method. When approved address for
    /// an NFT is changed or reaffirmed
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

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
        // TODO: Implement method
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
        // TODO: Implement method
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
        // TODO: Implement method
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
        // TODO: Implement method
    }

    /**
     * @notice Issues a new NFT in exchange for ethers at a parity of 1 NFT for 2 ethers
     * @dev Throw if msg.value is less then 2 ethers. Message: "mint - Invalid ether amount"
     * @dev Throw if `_recipient` is zero address. Message: "mint - Invalid parameter: _recipient"
     * @dev Throw if `_uri` is empty. Message: mint - Invalid parameter: _uri"
     * @param _recipient It is the recipient account for the new NFT
     * @param _uri It is the uri for the new NFT
     */
    function mint(address _recipient, string memory _uri) external {
        // TODO: Implement method
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
        // TODO: Implement method
    }
}