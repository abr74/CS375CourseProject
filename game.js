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
        player.size = { width: 16, height: 16 };
        player.velocity = { x: 200, y: 200 };
        player.asset = new PixelJS.AnimatedSprite();
        player.asset.prepare({ 
            name: 'char.png', 
            frames: 3, 
            rows: 4,
            speed: 200,
            defaultFrame: 1
        });
        

        var enemyLayer = game.createLayer('enemies');
        var enemy = playerLayer.createEntity();
        enemy.pos = { x: 200, y: 200 };
        enemy.velocity = { x: 100, y: 100 };
        enemy.size = { width: 16, height: 16 };
        enemy.asset = new PixelJS.AnimatedSprite();
        enemy.asset.prepare({
            name: 'pixil-frame-0.png',
            frames: 1,
            rows: 1,
            speed: 80,
            defaultFrame: 1
        });
        
        var itemLayer = game.createLayer('items');
        var coin = itemLayer.createEntity();
        coin.pos = { x: 400, y: 150 };
        coin.size = { width: 12, height: 16 };
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
            } 
            // else if (entity === enemy) {
            //     console.log("game over");
            // }
        });
        
        playerLayer.registerCollidable(player);
        playerLayer.registerCollidable(enemy);
        itemLayer.registerCollidable(coin);
        enemyLayer.registerCollidable(enemy);
        
        var score = 0;
        var scoreLayer = game.createLayer("score");
        scoreLayer.static = true;
        
        game.loadAndRun(function (elapsedTime, dt) {
            var chaseSpeed = 100;  // Set the speed at which the enemy moves toward the player
        
            // Calculate direction vector from enemy to player
            var dx = player.pos.x - enemy.pos.x// - 120;
            var dy = player.pos.y - enemy.pos.y// - 105;
        
            // Calculate the length of the direction vector
            var distance = Math.sqrt(dx * dx + dy * dy);
        
            // Normalize the direction vector (divide by the distance to get a unit vector)
            if (distance > 0) {
                dx /= distance;
                dy /= distance;
            }
        
            // Apply the speed to the normalized direction and update the enemy's position
            enemy.pos.x += dx * chaseSpeed * dt;
            enemy.pos.y += dy * chaseSpeed * dt;
        
            // Optional: Log position (or use it for debugging purposes)
            // console.log(enemy.pos.x, enemy.pos.y);

            
        
        });
        
    }
}