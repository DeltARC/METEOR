// Charger l'image des astéroides
	var enemyImage = new Image();
	enemyImage.src = "asteroid.png";
	
// Variables pour les ennemis
	var enemies = [];
	
// Fonction pour dessiner les astéroides
	function drawEnemies() {
		for (var i = 0; i < enemies.length; i++) {
			var enemy = enemies[i];
			ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
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
