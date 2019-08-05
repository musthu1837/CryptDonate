pragma solidity ^0.4.17;

contract DonationCampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(string title, string imageLink,
        string email, string pageLink, uint32 noOfDays, uint8 cause ,uint goal)
        public {

        address newCampaign = new DonationCampaign(title, imageLink, email, pageLink, noOfDays, cause, goal);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns ( address[] ) {
        return deployedCampaigns;
    }
}

contract DonationCampaign{
    address public manager;
    string public title;
    bool public closed;
    uint public createdTime;
    uint public totalCollectedMoney;
    uint32 public noOfDays;
    uint public goal;

    enum Cause {AnimalWelfare, ArtsandHeritage, ChildrenandYouth, Community, Disability, Education, Elderly, Environment, Families ,Health, Humanitarian, SocialService, Sports, WomenandGirls }
    Cause public cause;

    mapping(address => bool) public donators;
    uint32 public donatorsCount;

    mapping(address => bool) public validation;
    uint32 public validCount;

    mapping(address => uint) public donationAmount;

    struct Transaction{
        address sender;
        uint amount;
        uint createdTime;
        bool In;
    }
    Transaction[] public transactions;

    string[] public images;

    struct Contact{
        string email;
        string pageLink;
    }
    Contact public contactInfo;

    //modifiers
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    modifier durationNotCompleted(){
        require( (now - createdTime) < noOfDays*24*60*60);
        _;
    }

    modifier durationCompleted(){
        require((now - createdTime) >= noOfDays*24*60*60);
        _;
    }
    modifier notClosed(){
        require(!closed);
        _;
    }

    modifier isDonator(){
        require(donators[msg.sender]);
        _;
    }
    //constructor
    function DonationCampaign(string _title, string _imageLink,
        string _email, string _pageLink, uint32 _noOfDays, uint8 _cause, uint _goal)
        public{
        require((_goal > 0) && (_noOfDays >= 1));
        manager = tx.origin;
        title = _title;
        createdTime = now;
        contactInfo = Contact(_email, _pageLink);
        noOfDays = _noOfDays;
        cause = Cause(_cause);
        images.push(_imageLink);
        goal = _goal;
    }

    //methods
    function donate()
        durationNotCompleted public payable{
        //method body
        require(msg.value > 0 ether);
        if(!donators[msg.sender]){
            donators[msg.sender] = true;
            donatorsCount++;
            validation[msg.sender] = true;
            validCount++;
        }
        totalCollectedMoney += msg.value;
        donationAmount[msg.sender] += msg.value;
        transactions.push(Transaction(msg.sender, msg.value, now, false));
    }

    function uploadImage(string _imageLink)
        durationNotCompleted restricted public{
        //method body
        images.push(_imageLink);
    }

    function voteInvalidCampaign()
        durationNotCompleted isDonator public {
        //method body
        require(validation[msg.sender]);
        validation[msg.sender] = false;
        validCount--;
    }

    function voteValidCampaign()
        durationNotCompleted isDonator public {
        //method body
        require(!validation[msg.sender]);
        validation[msg.sender] = true;
        validCount++;
    }

    function updateContactInfo(string _email, string _pageLink)
        durationNotCompleted restricted public{
        //method body
        contactInfo = Contact(_email, _pageLink);
    }

    function finalizeCampaign()
        durationCompleted notClosed restricted public {
        //method body
        require(validCount >= (donatorsCount - validCount));
        if(totalCollectedMoney != 0){
            manager.transfer(address(this).balance);
            transactions.push(Transaction(address(this), totalCollectedMoney, now, true));
        }
        closed = true;
    }

    function withdrawAmount()
        durationCompleted notClosed isDonator public{
        //method body
        require(validCount < (donatorsCount - validCount));
        msg.sender.transfer(donationAmount[msg.sender]);
        donators[msg.sender] = false;
        transactions.push(Transaction(address(this), donationAmount[msg.sender], now, true));
        donationAmount[msg.sender] = 0;
        if(this.balance == 0 ether)
            closed = true;
    }

    function getSummary()
        public view returns(address, bool, uint, string ,
       uint, uint, uint, uint32, uint , Cause){
        return(
            manager,
            closed,
            createdTime,
            title,
            goal,
            donatorsCount,
            totalCollectedMoney,
            noOfDays,
            validCount,
            cause
        );
    }

    function getTransactionsLength() public view
        returns(uint){
        //method body
        return transactions.length;
    }

    function getImagesLength() public view
        returns(uint){
        //method body
        return images.length;
    }

    function getContactInfo() public view
        returns(string,string){
        //method body
        return (contactInfo.email, contactInfo.pageLink);
    }
    function isDurationcompleted() public view returns(bool){
        return ((now - createdTime) >= noOfDays*24*60*60);
    }
}
