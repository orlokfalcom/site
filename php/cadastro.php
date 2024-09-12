<?php
include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = md5($_POST['senha']);
    $tipo = $_POST['tipo']; // 'administrador' ou 'jogador'

    $query = "INSERT INTO usuarios (nome, email, senha, tipo) VALUES ('$nome', '$email', '$senha', '$tipo')";
    mysqli_query($conexao, $query);
    header('Location: login.php');
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cadastro de Usuário</title>
</head>
<body>
    <form method="POST" action="cadastro.php">
        <label for="nome">Nome:</label>
        <input type="text" name="nome" required>
        <label for="email">Email:</label>
        <input type="email" name="email" required>
        <label for="senha">Senha:</label>
        <input type="password" name="senha" required>
        <label for="tipo">Tipo de Usuário:</label>
        <select name="tipo">
            <option value="jogador">Jogador</option>
            <option value="administrador">Administrador</option>
        </select>
        <button type="submit">Cadastrar</button>
    </form>
</body>
</html>
