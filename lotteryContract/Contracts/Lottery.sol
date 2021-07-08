pragma solidity ^0.4.17;


contract Lottery {
    
    address public manager;
    
    address[] public players;
    
    function Lottery() public {
        // We will use a global variable to initiate the  manager to set to the address of the person 
        // who created this contract
        
        // msg object is a global variable to specify who just send a function invocation call ( Transaction )
        // msg.data ,msg.gas , msg.sender , msg.value ( ether )
        
        manager = msg.sender;
        
    }
    
    function enter() public  payable {
        // change the contents of contrct therefore a transaction
        // now we need to recieve an ether in ordere to enter 
        // whnever we create a function that expexcts to recieve an ether
        // we mark it as payable
        // now we need to do validation as we need ether to add the user
        // require function takes a boolean if false then code is exited
        // that is no chnge in contract else code is executed
        //  now msg.value is in wei so we need to convert it to ether but it would be
        // bad to convet to ether so we have a helper just put ether in front of value
        
        require(msg.value > 0.01 ether);
        
        players.push(msg.sender);
        
        
    }
    
    // There is no random number generator in solidity so we create a
    // pseudo random generator to use it to randomly pick a winner
    
    function random() private view returns (uint) {
        // we use sha3 for hashing different values
        return uint(keccak256(block.difficulty , now , players ));
        // sha3 and keccak256 are the same it is like keccak256 (class) , sha3 (object or instance)
    }
    
    
    function pickWinner() restricted {
        //only the manager can call it . put it to the top so to avoid excessive gas expenditure
        
        
        // require(manager == msg.sender);
        
        uint index = random() % players.length;
        // so address type has certain methods that can be called
        // transferring all the money the lottery has
        players[index].transfer(this.balance);
        
        // empty the players array . Note that this emptying also costs some ether so ..
        players = new address[](0);
        // new dynamic array of 0 length
    }
    
    // function modifier to make access only to manager
    modifier restricted() {
        require(manager == msg.sender);
        _;
        
    // if we add restricted to any function then solidity  will take all the code
    // of the function and replace the _  (Underscore) with the code and the function will  
    // look like require(manager == msg.sender) .. rest of the code of the function
    }
    
    
    function getPlayers() public view returns (address[]) {
        return players;
        
    }
    
    
    
    
}