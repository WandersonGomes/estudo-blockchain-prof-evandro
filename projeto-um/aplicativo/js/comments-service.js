console.log("Comments loading...");

//IMPORTA O MODULO DO WEB3
const Web3 = require('web3');

//DADOS DO SERVIDOR DA REDE ETHERIUM
const PROVIDER = 'ws://127.0.0.1:7545'

//DADOS DO CONTRATO DE COMENTARIOS
const ADDRESS_CONTRACT = '0xaA360a486DE9a0d3552cC3453a7D73db50b58A0c';
const ABI = [
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
          "name": "asset",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "comment",
          "type": "string"
        }
      ],
      "name": "Comment",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "asset",
          "type": "string"
        },
        {
          "name": "comment",
          "type": "string"
        }
      ],
      "name": "postComment",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
const DEFAULT_COUNT = '0xf408bB0Ec1Bd265738607c0804DF009486bb72c7';
const GAS_PRICE = 3000000;

//CRIACAO DO MICRO-SERVICO
const commentsService = {
  web3: null,
  contract: null,

  init: async function() {
    console.log("Inicializando Comments Service...");
    this.web3 = await new Web3(PROVIDER);
    this.contract = await new this.web3.eth.Contract(ABI, ADDRESS_CONTRACT, {from: DEFAULT_COUNT, gas: GAS_PRICE});
  },

  postComment: async function(data) {
    console.log("PostComment..." + data);
    return await this.contract.methods.postComment(data['asset'], data['comment']).send();
  },

  getComments: async function() {
    let data = await this.contract.getPastEvents(); //precisa pegar apenas os eventos de comentario
    return {'data': data};
  }
}

//EXPORTACAO DO SERVICO
module.exports = commentsService;
