pragma solidity 0.5.0;

contract Payment {
    address origenTransferencia;
    address payable destinoTransferencia;
    uint montoTransferencia;
    
    constructor() public {
        origenTransferencia = msg.sender;
    }

    event TransferirMonto(address payable _destinoTransferencia, address _origenTransferencia, uint montoTransferencia);
    
    function nuevaTransaccion(address payable _destinoTransferencia) public payable returns (bool){
        destinoTransferencia = _destinoTransferencia;
        destinoTransferencia.transfer(msg.value);
        emit TransferirMonto(destinoTransferencia, origenTransferencia, msg.value);
        return true;
    }
    function verBalanceCuenta() public payable returns (uint) {
        return origenTransferencia.balance;
    }
}