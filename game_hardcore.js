// Obtenez le canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Variables du jeu
var player = {
    x: 50,
    y: 50,
    width: 75,
    height: 75,
    speed: 8
};

var score = 0; // Variable pour stocker le score
var bestScore = 0; // Variable pour stocker le meilleur score

// Démarrez le compteur de score dès le début du jeu
var scoreInterval = setInterval(function() {
    score++; // Incrémentez le score de 1 à chaque seconde
}, 1000);

// Charger l'image du joueur
var playerImage = new Image();
playerImage.src = "vaisseau.png"; // Mettez le chemin correct vers votre image

// Charger l'image de l'ennemi
var enemyImage = new Image();
enemyImage.src = "asteroid.png"; // Mettez le chemin correct vers votre image d'ennemi

// Charger le son du tir
var shootSound = new Audio("laser.mp4"); // Mettez le chemin correct vers votre fichier audio

// Variables pour les projectiles
var projectiles = [];

// Variables pour les ennemis
var enemies = [];

// Fonction pour dessiner le joueur
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Fonction pour dessiner un projectile
function drawProjectile(projectile) {
    ctx.fillStyle = "#ff0000"; // Couleur rouge pour le projectile
    ctx.fillRect(projectile.x, projectile.y, 10, 5); // Dessiner un simple rectangle pour le projectile
}

// Fonction pour dessiner les ennemis avec des images
function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

// Fonction de mise à jour des projectiles
function updateProjectiles() {
    for (var i = 0; i < projectiles.length; i++) {
        var projectile = projectiles[i];
        projectile.x += 10; // Faites avancer le projectile vers la droite

        // Supprimer le projectile s'il sort du canvas
        if (projectile.x > canvas.width) {
            projectiles.splice(i, 1);
            i--;
        }
    }
}

// Fonction de mise à jour des ennemis
function updateEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        enemy.x -= enemy.speed; // Déplacer l'ennemi vers la gauche

        // Supprimer l'ennemi s'il sort du canvas
        if (enemy.x + enemy.width < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

// Fonction de mise à jour du jeu
function update() {
    // Déplacement du joueur
    if (keys[38]) { // Haut
        player.y -= player.speed;
    }
    if (keys[40]) { // Bas
        player.y += player.speed;
    }
    if (keys[37]) { // Gauche
        player.x -= player.speed;
    }
    if (keys[39]) { // Droite
        player.x += player.speed;
    }

    // Limites du canvas
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le joueur
    drawPlayer();

    // Mise à jour des projectiles
    updateProjectiles();

    // Dessiner les projectiles
    for (var i = 0; i < projectiles.length; i++) {
        drawProjectile(projectiles[i]);
    }

    // Génération des ennemis à intervalles réguliers
    if (Math.random() < 0.02) { // Contrôle de la fréquence d'apparition
        generateEnemies();
    }

    // Mise à jour des ennemis
    updateEnemies();

    // Dessiner les ennemis
    drawEnemies();

    // Dessiner le score
    drawScore();

    // Vérifier les collisions
    checkCollisions();

    // Appel récursif de la fonction update
    requestAnimationFrame(update);
}

// Fonction pour dessiner le score sur le canvas
function drawScore() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30); // Affichez le score dans le coin supérieur gauche du canvas
    ctx.fillText("Best Score: " + bestScore, 10, 60); // Affichez le meilleur score juste en dessous
}

// Gérer les touches du clavier
var keys = {};
window.addEventListener("keydown", function(event) {
    keys[event.keyCode] = true;
    if (event.keyCode === 32) { // Si la touche est la barre d'espace
        shootProjectile(); // Tirer un projectile
    }
});
window.addEventListener("keyup", function(event) {
    delete keys[event.keyCode];
});

// Fonction pour créer un nouveau projectile
function shootProjectile() {
    var projectile = {
        x: player.x + player.width, // Positionnez le projectile à droite du joueur
        y: player.y + player.height / 2, // Position verticale au milieu du joueur
    };
    projectiles.push(projectile); // Ajoutez le projectile au tableau des projectiles
    // Jouer le son du tir
    shootSound.play();
}

// Fonction pour générer des ennemis
function generateEnemies() {
    var enemyY = Math.random() * (canvas.height - 50); // Position y aléatoire
    var enemy = {
        x: canvas.width, // Début à droite du canvas
        y: enemyY,
        width: 75,
        height: 75,
        speed: 25		// Vitesse de déplacement
    };
    enemies.push(enemy); // Ajouter l'ennemi au tableau
}

// Fonction pour détecter les collisions entre le joueur et les ennemis
function checkCollisions() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            gameOver(); // Si une collision est détectée, appeler la fonction gameOver
        }
    }
}

// Fonction pour gérer le Game Over
function gameOver() {
    // Arrêter le compteur de score
    clearInterval(scoreInterval);

    // Mettre à jour le meilleur score si nécessaire
    if (score > bestScore) {
        bestScore = score;
    }

    // Réinitialiser le score à 0
    score = 0;

    // ... Votre code existant ici ...

    // Réinitialiser la position du joueur
    resetPlayerPosition();
    
    // Afficher un message "Game Over"
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
}

// Fonction pour réinitialiser la position du joueur
function resetPlayerPosition() {
    player.x = 50;
    player.y = 50;
}

// Lancer le jeu
var animationFrameId = requestAnimationFrame(update);