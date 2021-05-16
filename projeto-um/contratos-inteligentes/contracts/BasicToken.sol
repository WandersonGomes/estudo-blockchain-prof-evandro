pragma solidity ^0.5.8;

//ERC20 - Interface tokens do Etherium

contract BasicToken {
  //eventos
  event Transfer(address indexed from, address indexed to, uint256 value);

  //dados da moeda
  string public constant name = "Bitcoin";
  string public constant symbol = "BTC";
  uint8 public constant decimals = 18;

  //dados do contrato
  address public owner;
  address public treasury;
  uint256 public totalSupply;

  //balanco das carteiras
  mapping(address => uint256) private balances;

  //construtor do contrato
  constructor () public {
    owner = msg.sender;
    treasury = msg.sender;
    totalSupply = 1000 * 10 ** uint(decimals);
    balances[treasury] = totalSupply;
    emit Transfer(address(0), treasury, totalSupply);
  }

  function() external payable {
      revert();
  }

  //visualizar o total de tokens em uma carteira
  function balanceOf(address _tokenholder) public view returns (uint256 balance) {
      return balances[_tokenholder];
  }

  // tirando da carteira que ta chamando a funcao e colocando na carteira que foi informada
  function transfer(address _to, uint256 _value) public returns (bool) {
      require(_to != msg.sender, "O valor ta sendo enviado para a propria pessoa!");
      require(_to != address(0), "Tentando tirar o dinheiro de lugar nenhum!");
      require(_to != address(this), "O contrato ta mandando dinheiro para ele mesmo!");
      require(balances[msg.sender] - _value <= balances[msg.sender], "O saldo e insuficiente!");

      require(balances[_to] <= balances[_to] + _value);
      require(_value <= transferableTokens(msg.sender));

      balances[msg.sender] = balances[msg.sender] - _value;
      balances[_to] = balances[_to] + _value;

      emit Transfer(msg.sender, _to, _value);
      return true;
  }

  //transfere entre carteiras diferentes da carteira que ta chamando a funcao
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
      require(_from != address(0), "O valor ta sendo retirado de lugar nenhum!");
      require(_from != address(this), "O valor ta sendo retirado do contrato!");
      require(_to != _from, "Transferindo para o mesmo endereco de carteira!");
      require(_to != address(0), "O valor ta sendo enviado para lugar nenhum!");
      require(_to != address(this), "o valor ta sendo enviado para o endereco do contrato!");

      require(_value <= transferableTokens(_from));
      require(balances[_from] - _value <= balances[_from], "O saldo de quem esta enviando e insuficiente!");
      require(balances[_to] <= balances[_to] + _value);

      balances[_from] = balances[_from] - _value;
      balances[_to] = balances[_to] + _value;

      emit Transfer(_from, _to, _value);
      return true;
  }

  function transferableTokens(address holder) public view returns (uint256) {
      return balanceOf(holder);
  }
}
