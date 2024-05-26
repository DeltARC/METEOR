
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");


var player = {
    x: 50,
    y: 50,
    width: 75,
    height: 75,
    speed: 7.5,
};

var score = 0; 
var bestScore = 0; 


var scoreInterval = setInterval(function() {
    score++;
}, 1000);


var playerImage = new Image();
playerImage.src = "vaisseau.png"; 


var shootSound = new Audio("laser.mp4"); 

var projectiles = [];


var enemies = [];

function Enemy(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
}


function drawEnemy(enemy) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}


function generateEnemies() {
    var enemyWidth = 50;
    var enemyHeight = 50;
    var enemySpeed = 3;
    var x = canvas.width;
    var y = Math.random() * (canvas.height - enemyHeight);
    var newEnemy = new Enemy(x, y, enemyWidth, enemyHeight, enemySpeed);
    enemies.push(newEnemy);
}


function updateEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        enemy.x -= enemy.speed;


        if (enemy.x + enemy.width < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }
}


function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        drawEnemy(enemies[i]);
    }
}


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
                
                enemies.splice(j, 1);
                projectiles.splice(i, 1);
                i--; 
                break; 
            }
        }
    }
}


function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}


function drawProjectile(projectile) {
    ctx.fillRect(projectile.x, projectile.y, 10, 5);
}


function updateProjectiles() {
    for (var i = 0; i < projectiles.length; i++) {
        var projectile = projectiles[i];
        projectile.x += 10;

       
        if (projectile.x > canvas.width) {
            projectiles.splice(i, 1);
            i--;
        }
    }
}


function update() {
  
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


function shootProjectile() {
    var projectile = {
        x: player.x + player.width, // Positionnez le projectile à droite du joueur
        y: player.y + player.height / 2, // Position verticale au milieu du joueur
    };
    projectiles.push(projectile); 
   
    shootSound.play();
}


function gameOver() {
   
    clearInterval(scoreInterval);

    
    if (score > bestScore) {
        bestScore = score;
    }

  
    score = 0;


  
    resetPlayerPosition();
    
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
}


function resetPlayerPosition() {
    player.x = 50;
    player.y = 50;
}
