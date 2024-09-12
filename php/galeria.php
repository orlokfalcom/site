<?php
session_start();
include 'conexao.php';

if (!isset($_SESSION['id'])) {
    header('Location: login.php');
    exit();
}

$tipo_usuario = $_SESSION['tipo'];
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Galeria de Fotos</title>
</head>
<body>
    <header>
        <h1>Galeria de Fotos</h1>
        <nav>
            <a href="index.php">Início</a>
            <a href="chat.php">Chat Online</a>
            <a href="logout.php">Sair</a>
        </nav>
    </header>

    <main>
        <?php if ($tipo_usuario == 'administrador'): ?>
            <h2>Bem-vindo, Administrador! Você pode gerenciar todas as fotos.</h2>
            <a href="upload_foto.php">Adicionar Foto</a>
        <?php elseif ($tipo_usuario == 'jogador'): ?>
            <h2>Bem-vindo, Jogador! Você pode adicionar suas próprias fotos.</h2>
            <a href="upload_foto.php">Adicionar Minha Foto</a>
        <?php endif; ?>

        <section class="galeria-fotos">
            <h2>Fotos</h2>
            <div class="galeria">
                <?php
                if ($tipo_usuario == 'administrador') {
                    $query = "SELECT * FROM fotos";
                } else {
                    $id_usuario = $_SESSION['id'];
                    $query = "SELECT * FROM fotos WHERE id_usuario = $id_usuario";
                }
                $result = mysqli_query($conexao, $query);
                while ($foto = mysqli_fetch_assoc($result)) {
                    echo "<div><img src='{$foto['url_foto']}' alt='{$foto['descricao']}'></div>";
                }
                ?>
            </div>
        </section>
    </main>
</body>
</html>
