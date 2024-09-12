<?php
session_start();
include 'conexao.php';

if (!isset($_SESSION['id'])) {
    header('Location: login.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $descricao = $_POST['descricao'];
    $url_foto = $_POST['url_foto']; // Aqui você pode usar um upload de arquivos
    $id_usuario = $_SESSION['tipo'] == 'administrador' ? $_POST['id_usuario'] : $_SESSION['id'];

    $query = "INSERT INTO fotos (id_usuario, url_foto, descricao) VALUES ('$id_usuario', '$url_foto', '$descricao')";
    mysqli_query($conexao, $query);
    header('Location: galeria.php');
}
?>
