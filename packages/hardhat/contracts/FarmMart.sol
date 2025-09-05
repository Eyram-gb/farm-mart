//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */

 contract FarmMart {
    struct Listing {
        address payable farmer;
        string produce;
        string unit;
        uint256 unitPrice;
        uint256 available;
        bool active;
        string metadata;
    }

    struct Order {
        uint256 listingId;
        address buyer;
        uint256 quantity;
        uint256 totalPrice;
        bool farmerConfirmed;
        bool buyerConfirmed;
        bool released;
    }

    uint256 private nextId;
    uint256 private nextOrderId;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Order) public orders;

    event Listed(uint256 indexed id, address indexed farmer, string produce, string unit, uint256 unitPrice, uint256 available);
    event Updated(uint256 indexed id, uint256 unitPrice, uint256 available, bool active);
    event OrderCreated(uint256 indexed orderId, uint256 indexed listingId, address indexed buyer, uint256 quantity, uint256 totalPrice);
    event FarmerConfirmed(uint256 indexed orderId);
    event BuyerConfirmed(uint256 indexed orderId);
    event Released(uint256 indexed orderId, uint256 amount);
    event Refunded(uint256 indexed orderId, uint256 amount);

    // List produce
    function list(
        string calldata produce,
        string calldata unit,
        uint256 unitPrice,
        uint256 available,
        string calldata metadata
    ) external returns (uint256 id) {
        require(unitPrice > 0, "price=0");
        require(available > 0, "qty=0");
        id = ++nextId;
        listings[id] = Listing(payable(msg.sender), produce, unit, unitPrice, available, true, metadata);
        emit Listed(id, msg.sender, produce, unit, unitPrice, available);
    }

    // Update listing
    function update(uint256 id, uint256 newUnitPrice, uint256 newAvailable, bool active) external {
        Listing storage L = listings[id];
        require(L.farmer == msg.sender, "not farmer");
        require(L.farmer != address(0), "bad id");
        if (newUnitPrice > 0) L.unitPrice = newUnitPrice;
        L.available = newAvailable;
        L.active = active;
        emit Updated(id, L.unitPrice, L.available, L.active);
    }

    // Create order (funds stay in contract)
    function buy(uint256 id, uint256 quantity) external payable returns (uint256 orderId) {
        Listing storage L = listings[id];
        require(L.farmer != address(0), "bad id");
        require(L.active, "inactive");
        require(quantity > 0 && quantity <= L.available, "invalid qty");

        uint256 total = L.unitPrice * quantity;
        require(msg.value == total, "send exact amount");

        // reduce available
        L.available -= quantity;
        if (L.available == 0) L.active = false;

        // create order
        orderId = ++nextOrderId;
        orders[orderId] = Order(id, msg.sender, quantity, total, false, false, false);
        emit OrderCreated(orderId, id, msg.sender, quantity, total);
    }

    // Farmer confirms dispatch
    function confirmSent(uint256 orderId) external {
        Order storage O = orders[orderId];
        require(O.buyer != address(0), "bad order");
        Listing storage L = listings[O.listingId];
        require(msg.sender == L.farmer, "not farmer");
        require(!O.released, "already released");
        O.farmerConfirmed = true;
        emit FarmerConfirmed(orderId);
    }

    // Buyer confirms receipt
    function confirmReceived(uint256 orderId) external {
        Order storage O = orders[orderId];
        require(O.buyer == msg.sender, "not buyer");
        require(O.farmerConfirmed, "farmer not confirmed");
        require(!O.released, "already released");
        O.buyerConfirmed = true;
        _release(orderId);
        emit BuyerConfirmed(orderId);
    }

    // Internal release
    function _release(uint256 orderId) internal {
        Order storage O = orders[orderId];
        require(O.farmerConfirmed && O.buyerConfirmed, "handshake incomplete");
        Listing storage L = listings[O.listingId];
        O.released = true;
        (bool ok,) = L.farmer.call{value: O.totalPrice}("");
        require(ok, "pay failed");
        emit Released(orderId, O.totalPrice);
    }

    function getHash(string memory _productID) public pure returns (bytes32) {
		return keccak256(abi.encodePacked(_productID));
	}

}
// contract YourContract {
//     // State Variables
//     address public immutable owner;
//     string public greeting = "Building Unstoppable Apps!!!";
//     bool public premium = false;
//     uint256 public totalCounter = 0;
//     mapping(address => uint) public userGreetingCounter;

//     // Events: a way to emit log statements from smart contract that can be listened to by external parties
//     event GreetingChange(address indexed greetingSetter, string newGreeting, bool premium, uint256 value);

//     // Constructor: Called once on contract deployment
//     // Check packages/hardhat/deploy/00_deploy_your_contract.ts
//     constructor(address _owner) {
//         owner = _owner;
//     }

//     // Modifier: used to define a set of rules that must be met before or after a function is executed
//     // Check the withdraw() function
//     modifier isOwner() {
//         // msg.sender: predefined variable that represents address of the account that called the current function
//         require(msg.sender == owner, "Not the Owner");
//         _;
//     }

//     /**
//      * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
//      *
//      * @param _newGreeting (string memory) - new greeting to save on the contract
//      */
//     function setGreeting(string memory _newGreeting) public payable {
//         // Print data to the hardhat chain console. Remove when deploying to a live network.
//         console.log("Setting new greeting '%s' from %s", _newGreeting, msg.sender);

//         // Change state variables
//         greeting = _newGreeting;
//         totalCounter += 1;
//         userGreetingCounter[msg.sender] += 1;

//         // msg.value: built-in global variable that represents the amount of ether sent with the transaction
//         if (msg.value > 0) {
//             premium = true;
//         } else {
//             premium = false;
//         }

//         // emit: keyword used to trigger an event
//         emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, msg.value);
//     }

//     /**
//      * Function that allows the owner to withdraw all the Ether in the contract
//      * The function can only be called by the owner of the contract as defined by the isOwner modifier
//      */
//     function withdraw() public isOwner {
//         (bool success, ) = owner.call{ value: address(this).balance }("");
//         require(success, "Failed to send Ether");
//     }

//     /**
//      * Function that allows the contract to receive ETH
//      */
//     receive() external payable {}
// }

