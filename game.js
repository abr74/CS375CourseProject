document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();
        game.init({
            container: 'game_container',
            width: 800,
            height: 600
        });
        
        var backgroundLayer = game.createLayer('background');
        var grass = backgroundLayer.createEntity();
        backgroundLayer.static = true;
        grass.pos = { x: 0, y: 0 };
        grass.asset = new PixelJS.Tile();
        grass.asset.prepare({
            name: 'grass.png',
            size: { 
                width: 800, 
                height: 600 
            }
        });
        
        var playerLayer = game.createLayer('players');
        var player = new PixelJS.Player();
        player.addToLayer(playerLayer);
        player.pos = { x: 200, y: 300 };
        player.size = { width: 32, height: 32 };
        player.velocity = { x: 100, y: 100 };

        player.moveLeft = function() {
            if (this.canMoveLeft && this.pos.x > 0) {
                this.pos.x -= this.velocity.x * this.layer.engine._deltaTime;
            }
        };

        player.moveRight = function() {
            if (this.canMoveRight && this.pos.x + this.size.width < 800) {
                this.pos.x += this.velocity.x * this.layer.engine._deltaTime;
            }
        };

        player.moveUp = function() {
            if (this.canMoveUp && this.pos.y > 0) {
                this.pos.y -= this.velocity.y * this.layer.engine._deltaTime;
            }
        };

        player.moveDown = function() {
            if (this.canMoveDown && this.pos.y + this.size.height < 600) {
                this.pos.y += this.velocity.y * this.layer.engine._deltaTime;
            }
        };

        player.asset = new PixelJS.AnimatedSprite();
        player.asset.prepare({ 
            name: 'char.png', 
            frames: 3, 
            rows: 4,
            speed: 100,
            defaultFrame: 1
        });

        var enemyLayer = game.createLayer('enemies');
        var enemies = [];
        var maxEnemies = 5;
        var enemySpawnInterval = 10000;
        var releaseInterval = 5000;
        var releasedEnemiesCount = 0;

        function createEnemy(x, y) {
            var newEnemy = enemyLayer.createEntity();
            newEnemy.pos = { x: x, y: y };
            newEnemy.velocity = { x: 0, y: 0 };
            newEnemy.size = { width: 16, height: 16 };
            newEnemy.asset = new PixelJS.AnimatedSprite();
            newEnemy.asset.prepare({
                name: 'pixil-frame-0.png',
                frames: 1,
                rows: 1,
                speed: 80,
                defaultFrame: 0
            });    
            enemies.push(newEnemy);
            newEnemy.addToLayer(enemyLayer);
            enemyLayer.redraw = true; 
            newEnemy.visible = true;
            enemyLayer.registerCollidable(newEnemy);
        }

        createEnemy(-155, 100);
        createEnemy(-155, 200);
        createEnemy(-155, 300);

        var releaseEnemyInterval = setInterval(function() {
            if (releasedEnemiesCount < enemies.length) {
                enemies[releasedEnemiesCount].velocity = { x: 100, y: 100 };
                releasedEnemiesCount++;
            } else {
                clearInterval(releaseEnemyInterval);
            }
        }, releaseInterval);

        setInterval(function() {
            if (enemies.length < maxEnemies) {
                createEnemy(
                    Math.floor(Math.random() * (800 - 16)),
                    Math.floor(Math.random() * (600 - 16))
                );
            }
        }, enemySpawnInterval);

        console.log("actually im here");

        
        var itemLayer = game.createLayer('items');
        var coin = itemLayer.createEntity();
        coin.pos = { x: 400, y: 150 };
        coin.size = { width: 16, height: 16 };
        coin.asset = new PixelJS.AnimatedSprite();
        coin.asset.prepare({
            name: 'coin.png',
            frames: 8,
            rows: 1,
            speed: 80,
            defaultFrame: 0
        });
 
        var collectSound = game.createSound('collect');
        collectSound.prepare({ name: 'coin.mp3' });
        
        var powerupLayer = game.createLayer('powerups');
        var speedBoost = powerupLayer.createEntity();
        speedBoost.pos = { 
            x: Math.floor(Math.random() * (700 - 100 + 1) + 100),
            y: Math.floor(Math.random() * (500 - 100 + 1) + 100)
        };
        
        speedBoost.size = { width: 16, height: 16 };
        speedBoost.asset = new PixelJS.AnimatedSprite();
        speedBoost.asset.prepare({
            name: 'speedboost.png',
            frames: 8,
            rows: 1,
            speed: 80,
            defaultFrame: 0
        });

        var powerupSound = game.createSound('powerup');
        powerupSound.prepare({ name: 'powerup.wav' }); 

        
        player.onCollide(function (entity) {
            if (entity === coin) {
                collectSound.play();
                coin.pos = {
                    x: Math.floor(Math.random() * (700 - 100 + 1) + 100),
                    y: Math.floor(Math.random() * (500 - 100 + 1) + 100)
                };
                
                score += 1;
            } else if (entity === speedBoost) {
                powerupSound.play();

                var originalVelocityX = player.velocity.x;
                var originalVelocityY = player.velocity.y;
                
                player.velocity.x = 200;
                player.velocity.y = 200;
                
                isSpeedBoosted = true;
                speedBoostTimer = 10;  
                
                speedBoost.pos = {
                    x: Math.floor(Math.random() * (700 - 100 + 1) + 100),
                    y: Math.floor(Math.random() * (500 - 100 + 1) + 100)
                };
                
                setTimeout(function() {
                    player.velocity.x = originalVelocityX;
                    player.velocity.y = originalVelocityY;
                    isSpeedBoosted = false;
                    speedBoostTimer = 0;

                }, 10000);
            }
        });
        
        playerLayer.registerCollidable(player);
        itemLayer.registerCollidable(coin);
        powerupLayer.registerCollidable(speedBoost);
        
        var score = 0;
        var speedBoostTimer = 0;  
        var isSpeedBoosted = false;  
        var scoreLayer = game.createLayer("score");
        scoreLayer.static = true;
        
        enemyLayer.redraw = true;

        
        game.loadAndRun(function (elapsedTime, dt) {
            
            enemies.forEach(function(enemy) {
                enemy.visible = true;
                console.log(`Enemy position: ${enemy.pos.x}, ${enemy.pos.y}`);
                console.log(enemy.layer);
                enemy.pos.x += enemy.velocity.x * dt;
                enemy.pos.y += enemy.velocity.y * dt;
                if (enemy.pos.x <= -160 || enemy.pos.x >= 650) {
                    enemy.velocity.x = -enemy.velocity.x;
                }
                if (enemy.pos.y <= -160 || enemy.pos.y >= 450) {
                    enemy.velocity.y = -enemy.velocity.y;
                }
                enemyLayer.draw();
            });

            enemyLayer.draw();

            console.log("nope here");
            
            scoreLayer.redraw = true;
            scoreLayer.drawText(
                'Coins: ' + score, 
                50, 
                50, 
                '14pt "Trebuchet MS", Helvetica, sans-serif', 
                '#FFFFFF',
                'left'
            );

            if (isSpeedBoosted) {
                speedBoostTimer -= dt;  
                
                scoreLayer.redraw = true;
                scoreLayer.drawText(
                    'Speed Boost: ' + Math.ceil(speedBoostTimer) + 's', 
                    160, 
                    80, 
                    '14pt "Trebuchet MS", Helvetica, sans-serif', 
                    '#FFFF00',  
                    'right'
                );
            }
            
        });
    }
}