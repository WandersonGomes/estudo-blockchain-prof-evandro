
pragma solidity ^0.5.8;

contract Purchasing {
    //eventos producao e debug
    event Product(string product, uint quantity, string url, string price, string description, string company, string id);
    event ProductAddQuantity(string product, uint quantity);
    event ProductPurchaser(string product, address purchaser);

    //detalhes do produto
    struct ProductDetails {
        uint quantity;
        address[] purchasers;
        string url;
        string description;
        string price;
        string company;
        string id;
        bool isSet;
    }

    //lista de produtos
    mapping(string => ProductDetails) public productList;
    address public authority; //loja

    //constructor
    constructor() public {
        authority = msg.sender;
    }

    //adicionar um produto
    function addProduct(string memory product, uint addQuantity, string memory url, string memory description, string memory price, string memory company, string memory id) public {
        productList[product].quantity = addQuantity;
        productList[product].url = url;
        productList[product].price = price;
        productList[product].description = description;
        productList[product].company = company;
        productList[product].id = id;
        productList[product].isSet = true;

        emit Product(product, addQuantity, url, price, description, company, id);
    }

    //adicionar uma quantidade de produtos num produto ja cadastrado
    function addProductQuantity(string memory product, uint addQuantity) public {
        require(productList[product].isSet, "Produto nao esta disponivel!");
        productList[product].quantity += addQuantity;

        emit ProductAddQuantity(product, addQuantity);
    }

    //adicionar comprador na lista de compradores do produto
    function purchaseProduct(string memory product, address purchaser) public {
        require(productList[product].purchasers.length < productList[product].quantity);
        productList[product].purchasers.push(purchaser);

        emit ProductPurchaser(product, purchaser);
    }

    //ver a lista de compradores de um produto
    function getPurchasers(string memory product) public view returns (address[] memory purchasers) {
        return productList[product].purchasers;
    }
}
