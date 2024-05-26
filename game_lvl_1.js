// Obtention du canvas
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");

// Variables du jeu
	var player = {
    x: 50,
    y: 420,
    width: 75,
    height: 75,
    speed: 7
	};
	
// Variable pour noter le score
	var score = 0;
// Variable pour stocker le meilleur score
	var bestScore = 0;

// Démarrez le compteur de score dès le début du jeu
	var scoreInterval = setInterval(function() {
// Augmenter le score de 1 à chaque seconde		
		score++;
	}, 1000);

// Charger l'image du joueur
	var playerImage = new Image();
	playerImage.src = "vaisseau66.png";

// Charger l'image des aliens
	var enemyImage = new Image();
	enemyImage.src = "asteroid.png";

// Charger le son du tir
	var shootSound = new Audio("laser.mp4");

// Variables pour les tirs
	var projectiles = [];

// Variables pour les ennemis
	var enemies = [];
	
	// Variables pour les ennemis qui suivent ces fdp
	var homingEnemies = [];
	
	// Nouvelle classe d'ennemi qui se dirige vers le joueur
function HomingEnemy(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

// Fonction pour dessiner le joueur sur le canvas
	function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
	}

// Fonction pour dessiner un tir
	function drawProjectile(projectile) {
		ctx.fillStyle = "#ffff00";
		ctx.fillRect(projectile.x, projectile.y, 10, 5);
		}

// Fonction pour dessiner les astéroides
	function drawEnemies() {
		for (var i = 0; i < enemies.length; i++) {
			var enemy = enemies[i];
			ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
		}
	}
	
	// Fonction pour dessiner un ennemi qui se dirige vers le joueur
function drawHomingEnemy(enemy) {
    ctx.fillStyle = "#0000ff"; // Couleur bleue pour les ennemis qui se dirigent vers le joueur
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

// Fonction de mise à jour des projectiles
	function updateProjectiles() {
    for (var i = 0; i < projectiles.length; i++) {
        var projectile = projectiles[i];
        projectile.x += 10;

// Supprime le projectile s'il s'échappe du canvas
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
        enemy.x -= enemy.speed;

// Supprimer l'ennemi s'il s'enfuit du canvas
        if (enemy.x + enemy.width < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }
	}

// Fonction de mise à jour des ennemis qui se dirigent vers le joueur
function updateHomingEnemies() {
    for (var i = 0; i < homingEnemies.length; i++) {
        var enemy = homingEnemies[i];
        // Calculer le vecteur de direction vers le joueur
        var dx = player.x - enemy.x;
        var dy = player.y - enemy.y;
        // Normaliser le vecteur de direction
        var length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;
        // Mettre à jour la position de l'ennemi en fonction de la direction
        enemy.x += dx * enemy.speed;
        enemy.y += dy * enemy.speed;

        // Supprimer l'ennemi s'il sort du canvas
        if (enemy.x + enemy.width < 0 || enemy.x > canvas.width || enemy.y + enemy.height < 0 || enemy.y > canvas.height) {
            homingEnemies.splice(i, 1);
            i--;
        }
    }
}

// Fonction de mise à jour du joueur
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


// Dessiner le score
    drawScore();

// Vérifier les collisions
    checkCollisions();

// Appel récursif de la fonction update
    requestAnimationFrame(update);
}

// Fonction pour dessiner le score sur le canvas
	function drawScore() {
    ctx.fillStyle = "#AC21BC";
    ctx.font = "35px Bahnschrift";
    ctx.fillText("Score: " + score, 10, 40); // Affiche le score dans le coin en haut à gauche du canvas
    ctx.fillText("Best Score: " + bestScore, 10, 80); // Affiche le meilleur score juste en dessous !
}

// Gérer les touches du clavier
	var keys = {};
	window.addEventListener("keydown", function(event) {
    keys[event.keyCode] = true;
    if (event.keyCode === 32) { // Si la barre espace est pressé alors...
        shootProjectile(); // ...tirez !!
    }
});
	window.addEventListener("keyup", function(event) {
    delete keys[event.keyCode];
});

// Fonction pour créer un nouveau projectile à tirer
	function shootProjectile() {
    var projectile = {
        x: player.x + player.width, // Positionnez le projectile à droite du joueur
        y: player.y + player.height / 2, // Position verticale égale à celle du joueur
    };
    projectiles.push(projectile); // Ajoutez le projectile au tableau des projectiles
    // Joue le son du tir
    shootSound.play();
}

// Fonction pour générer les astéroides
	function generateEnemies() {
    var enemyY = Math.random() * (canvas.height - 50); // Position y aléatoire
    var enemy = {
        x: canvas.width, // Spawn tout à droite du canvas
        y: enemyY,
        width: 50,
        height: 50,
        speed: 15
    };
    enemies.push(enemy); // Ajouter l'ennemi sur le canvas
}

// Fonction pour détecter les collisions entre le joueur et les astéroides (= la mort x_x)
	function checkCollisions() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            gameOver(); // Si une collision est détectée, appeler la fonction gameOver, cette partie est terminée mais vous pouvez toujours réessayer !
        }
    }
}

// Fonction qui gère le Game Over
	function gameOver() {
// Arrêter le compteur de score
    clearInterval(scoreInterval);

// Mettre à jour le meilleur score (si cela est nécessaire...)
    if (score > bestScore) {
        bestScore = score;
    }

// Réinitialiser le score à 0
    score = 0;

// Réinitialiser la position du joueur
    resetPlayerPosition();
    
// Afficher "Game Over"
    const myTimeout =
	setTimeout(5000);
	ctx.fillStyle = "red";
    ctx.font = "90px Impact";
    ctx.fillText("GAME OVER", canvas.width / 2 - 80, canvas.height / 2);
	setTimeout()
}

// Fonction qui s'occupe de la réinitialisation de la position du joueur
	function resetPlayerPosition() {
    player.x = 50;
    player.y = 450;
}

// Lancer le jeu
	var animationFrameId = requestAnimationFrame(update);
	
//FIN POUR L'INSTANT//