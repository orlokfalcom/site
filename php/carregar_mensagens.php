<?php
include 'conexao.php';

$query = "SELECT usuarios.nome, chat.mensagem FROM chat INNER JOIN usuarios ON chat.id_usuario = usuarios.id ORDER BY chat.id DESC";
$result = mysqli_query($conexao, $query);

while ($mensagem = mysqli_fetch_assoc($result)) {
    echo "<p><strong>{$mensagem['nome']}</strong>: {$mensagem['mensagem']}</p>";
}
?>
