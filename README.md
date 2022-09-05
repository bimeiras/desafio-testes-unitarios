# Cadastro de usuários
**RF**
Deve ser possível cadastrar um novo usuário

**RN**
Não deve ser possível cadastrar usuário quando o e-mail já esitver sendo utilizado.


# Autenticação de usuário
**RF**
Deve ser possível autenticar usuário.

**RN**
Não deve ser possível autenticar usuário com senha inválida.
Não deve ser possível autenticar usuário não existente.

# Acesso ao perfil do usuário
**RF**
Deve ser possível acessar o perfil de um usuário

**RN**
Não deve ser possível mostrar o perfil de um usuário não existente.

# Acesso ao saldo do usuário
**RF**
Deve ser possível mostrar o saldo do usuário.

**RN**
Não deve ser possível mostrar o saldo de um usuário não existente.

# Criação de Transações
**RF**
Deve ser possível realizar depósito na conta do usuário.
Deve ser possível realizar saque na conta do usuário.


**RN**
Não deve ser possível realizar depósito em uma conta não existente.
Não deve ser possível realizar saque em uma conta não existente.
Não deve ser possível realizar saque caso o saldo seja insuficiente.


# Acesso a informações da transação:
**RF**
Deve ser possível obter informações de uma transação.

**RN**
Não deve ser possível obter informações de uma transação de uma conta não existente.
Não deve ser possível obter informações de uma transação não existente.


# Transferência entre contas:
**RF**
Deve ser possível transferir valores entre duas contas.

**RN**
Não deve ser possível transferir valor se o usuário remetente não existir.
Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta.
Não deve ser possível transferir valor se o usuário destinatário não existir.
O saldo deve considerar o valor transferido (ou recebido) entre duas contas.
Ao mostrar o saldo do usuário, as operações do tipo transfer devem aparecer detalhadas.

