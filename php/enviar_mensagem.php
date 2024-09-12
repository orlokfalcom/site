<?php
session_start();
include 'conexao.php';

if (isset($_POST['mensagem'])) {
    $mensagem = $_POST['mensagem'];
    $id_usuario = $_SESSION['id'];
    
    $query = "INSERT INTO chat (id_usuario, mensagem) VALUES ('$id_usuario', '$mensagem')";
    mysqli_query($conexao, $query);
}
?>
