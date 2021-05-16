console.log("Payments loading...");

//IMPORTA O MODULO DO WEB3
const Web3 = require('web3');

//DADOS DO SERVIDOR DA REDE ETHERIUM
const PROVIDER = 'ws://127.0.0.1:7545'

//DADOS DO CONTRATO DE COMENTARIOS
const ADDRESS_CONTRACT = '0x13A6cDA0e6e1815308Bc7302477FfFbF68749926';
const ABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "treasury",
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
      "constant": true,
      "inputs": [],
      "name": "owner",
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
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
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
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_tokenholder",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "holder",
          "type": "address"
        }
      ],
      "name": "transferableTokens",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
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
const paymentsService = {
  web3: null,
  contract: null,

  init: async function() {
    console.log("Inicializando Payments Service...");
    this.web3 = await new Web3(PROVIDER);
    this.contract = await new this.web3.eth.Contract(ABI, ADDRESS_CONTRACT, {from: DEFAULT_COUNT, gas: GAS_PRICE});
  },

  balanceOf: async function(address) {
    let balance = 0;
    try {
      balance = await this.contract.methods.balanceOf(address).call();
      console.log(balance);
    } catch(e) {
      console.error(e.message)
    }

    return (parseInt(balance, 16)/Math.pow(10, 18));
  },

  transferFrom: async function (sender, recipient, amount) {
      const funds = (amount * Math.pow(10, 18)).toString(16);
      try {
        let result =  await this.contract.methods.transferFrom(sender, recipient, amount).send();
        return result;
      } catch (e) {
        console.error(e.message);
      }
  }
}

//EXPORTACAO DO SERVICO
module.exports = paymentsService;
