<?php
session_start();
include 'conexao.php';

if (!isset($_SESSION['id'])) {
    header('Location: login.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Chat Online</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function(){
            function loadMessages(){
                $.ajax({
                    url: 'carregar_mensagens.php',
                    success: function(data) {
                        $('#mensagens').html(data);
                    }
                });
            }

            loadMessages();
            setInterval(loadMessages, 2000);

            $('#enviar').on('click', function(){
                var mensagem = $('#mensagem').val();
                if (mensagem != '') {
                    $.post('enviar_mensagem.php', {mensagem: mensagem}, function(){
                        $('#mensagem').val('');
                        loadMessages();
                    });
                }
            });
        });
    </script>
</head>
<body>
    <h1>Chat com os Desenvolvedores</h1>

    <div id="mensagens"></div>

    <input type="text" id="mensagem">
    <button id="enviar">Enviar</button>
</body>
</html>
