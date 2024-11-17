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
            name: 'coin.png',
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
                scoreLayer.redraw = true;
                scoreLayer.drawText(
                    'Coins: ' + score, 
                    50, 
                    50, 
                    '14pt "Trebuchet MS", Helvetica, sans-serif', 
                    '#FFFFFF',
                    'left'
                );
            } else if (entity === speedBoost) {
                powerupSound.play();

                var originalVelocityX = player.velocity.x;
                var originalVelocityY = player.velocity.y;
                
                player.velocity.x == 200;
                player.velocity.y *= 2;
                
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
        
        game.loadAndRun(function (elapsedTime, dt) {
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