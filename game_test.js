// Obtention du canvas
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");

// Variables du jeu
var player = {
    x: 50,
    y: 50,
    width: 75,
    height: 75,
    speed: 7.5,
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

// Charger le son du tir
var shootSound = new Audio("laser.mp4"); // Mettez le chemin correct vers votre fichier audio

// Variables pour les projectiles
var projectiles = [];

// Structure des ennemis
var enemies = [];

function Enemy(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
}

// Fonction pour dessiner un ennemi
function drawEnemy(enemy) {
    ctx.fillStyle = "#ff0000"; // Couleur verte pour les ennemis
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

// Fonction pour générer des ennemis
function generateEnemies() {
    var enemyWidth = 50;
    var enemyHeight = 50;
    var enemySpeed = 3;
    var x = canvas.width;
    var y = Math.random() * (canvas.height - enemyHeight);
    var newEnemy = new Enemy(x, y, enemyWidth, enemyHeight, enemySpeed);
    enemies.push(newEnemy);
}

// Fonction de mise à jour des ennemis
function updateEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        enemy.x -= enemy.speed; // Faites avancer l'ennemi vers la gauche

        // Supprimer l'ennemi s'il sort du canvas
        if (enemy.x + enemy.width < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

// Dessiner tous les ennemis
function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        drawEnemy(enemies[i]);
    }
}

// Mise à jour des collisions avec les ennemis
function checkCollisions() {
    for (var i = 0; i < projectiles.length; i++) {
        var projectile = projectiles[i];
        for (var j = 0; j < enemies.length; j++) {
            var enemy = enemies[j];
            if (
                projectile.x < enemy.x + enemy.width &&
                projectile.x + 10 > enemy.x &&
                projectile.y < enemy.y + enemy.height &&
                projectile.y + 5 > enemy.y
            ) {
                // Collision détectée, supprimer l'ennemi et le projectile
                enemies.splice(j, 1);
                projectiles.splice(i, 1);
                i--; // Décrémentez i pour éviter de sauter un projectile
                break; // Sortez de la boucle interne, car un projectile ne peut toucher qu'un ennemi à la fois
            }
        }
    }
}

// Fonction pour dessiner le joueur
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Fonction pour dessiner un projectile
function drawProjectile(projectile) {
    ctx.fillStyle = "#ff0000"; // Couleur rouge pour le projectile
    ctx.fillRect(projectile.x, projectile.y, 10, 5); // Dessiner un simple rectangle pour le projectile
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

    // Dessiner tous les ennemis
    drawEnemies();

    // Mettre à jour les ennemis
    updateEnemies();

    // Vérifier les collisions entre les projectiles et les ennemis
    checkCollisions();

    // Dessiner le score
    drawScore();

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

// Lancer le jeu
var animationFrameId = requestAnimationFrame(update);

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
