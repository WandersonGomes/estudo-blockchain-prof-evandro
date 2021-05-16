console.log("Purchase loading...");

//IMPORTA O MODULO DO WEB3
const Web3 = require('web3');

//DADOS DO SERVIDOR DA REDE ETHERIUM
const PROVIDER = 'ws://127.0.0.1:7545'

//DADOS DO CONTRATO DE COMENTARIOS
const ADDRESS_CONTRACT = '0xE46Ad30b6cD43EB17bD9Be59A7e1a8c5673D34E7';
const ABI = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "name": "productList",
      "outputs": [
        {
          "name": "quantity",
          "type": "uint256"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "price",
          "type": "string"
        },
        {
          "name": "company",
          "type": "string"
        },
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "isSet",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "authority",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "product",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "quantity",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "url",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "price",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "company",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "id",
          "type": "string"
        }
      ],
      "name": "Product",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "product",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "ProductAddQuantity",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "product",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "purchaser",
          "type": "address"
        }
      ],
      "name": "ProductPurchaser",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "product",
          "type": "string"
        },
        {
          "name": "addQuantity",
          "type": "uint256"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "price",
          "type": "string"
        },
        {
          "name": "company",
          "type": "string"
        },
        {
          "name": "id",
          "type": "string"
        }
      ],
      "name": "addProduct",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "product",
          "type": "string"
        },
        {
          "name": "addQuantity",
          "type": "uint256"
        }
      ],
      "name": "addProductQuantity",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "product",
          "type": "string"
        },
        {
          "name": "purchaser",
          "type": "address"
        }
      ],
      "name": "purchaseProduct",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "product",
          "type": "string"
        }
      ],
      "name": "getPurchasers",
      "outputs": [
        {
          "name": "purchasers",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
const DEFAULT_COUNT = '0xf408bB0Ec1Bd265738607c0804DF009486bb72c7';
const GAS_PRICE = 3000000;

//CRIACAO DO MICRO-SERVICO
const purchaseService = {
  web3: null,
  contract: null,

  init: async function() {
    console.log("Inicializando Purchase Service...");
    this.web3 = await new Web3(PROVIDER);
    this.contract = await new this.web3.eth.Contract(ABI, ADDRESS_CONTRACT, {from: DEFAULT_COUNT, gas: GAS_PRICE});
  },

  addProduct: async function (product, quantity, url, description, price, company, id) {
        quantity = parseInt(quantity);

        try {
          let result = await this.contract.methods.addProduct(product, quantity, url, description, price, company, id).send();
          console.log(result);
          return result;
        } catch (e) {
          console.log(e.message);
        }
    },

  purchaseProduct: async function (product, buyerAddress) {
      console.log("purchaseService...");
      try {
        let result = await this.contract.methods.purchaseProduct(product, buyerAddress).send();
        console.log(result);
        return result;
      } catch (e) {
        console.log(e.message);
      }
  },

  getProducts: async function () {
      return await this.contract.getPastEvents(); //filtragem apenas dos produtos
  },

  getPurchasers: async function (productID) {
      let purchasers = await this.contract.methods.getPurchasers(productID).call();
      return purchasers;
  }
}

//EXPORTACAO DO SERVICO
module.exports = purchaseService;
