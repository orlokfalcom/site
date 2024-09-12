<?php
session_start();
include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $senha = md5($_POST['senha']);

    $query = "SELECT * FROM usuarios WHERE email = '$email' AND senha = '$senha'";
    $result = mysqli_query($conexao, $query);
    $usuario = mysqli_fetch_assoc($result);

    if ($usuario) {
        $_SESSION['id'] = $usuario['id'];
        $_SESSION['nome'] = $usuario['nome'];
        $_SESSION['tipo'] = $usuario['tipo']; // Administrador ou Jogador
        header('Location: galeria.php');
    } else {
        echo "Usuário ou senha inválidos.";
    }
}
?>
