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
        //console.log(player.layer);
        player.pos = { x: 200, y: 300 };
        player.size = { width: 10, height: 10 };
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
        var enemies = []

        function tryNewEnemy(position) {
            var newEnemy = enemyLayer.createEntity();
            newEnemy.pos = { x: position.x, y: position.y }; // Set position based on the parameter
            newEnemy.velocity = { x: 100, y: 100 };
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

        var bossLayer = game.createLayer('bosses');
        var enemies = []

        function tryNewBoss(position) {
            var newBoss = bossLayer.createEntity();
            newBoss.pos = { x: position.x, y: position.y }; // Set position based on the parameter
            newBoss.velocity = { x: 30, y: 30 };
            newBoss.size = { width: 16, height: 16 };
            newBoss.asset = new PixelJS.AnimatedSprite();
            newBoss.asset.prepare({
                name: 'big-boss.png',
                frames: 1,
                rows: 1,
                speed: 80,
                defaultFrame: 0
            });    
            enemies.push(newBoss);
            newBoss.addToLayer(bossLayer);
            bossLayer.redraw = true; 
            newBoss.visible = true;
            bossLayer.registerCollidable(newBoss);
        }

        tryNewEnemy({ x: 250, y: 250 });
        tryNewBoss({ x: 250, y: 250 });

        tryNewEnemy({ x: 250, y: 1000 });
        tryNewEnemy({ x: -2000, y: 250 });
        tryNewEnemy({ x: 250, y: -3000 });
        tryNewEnemy({ x: 4000, y: 250 });

        tryNewEnemy({ x: 250, y: 5000 });
        tryNewEnemy({ x: -6000, y: 250 });
        tryNewEnemy({ x: 250, y: -7000 });
        tryNewEnemy({ x: 8000, y: 250 });

        tryNewEnemy({ x: 250, y: 9000 });
        tryNewEnemy({ x: 10000, y: 250 });
        tryNewEnemy({ x: 250, y: 11000 });
        tryNewEnemy({ x: 12000, y: 250 });
        
        

        console.log("actually im here");


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
        });
        
        playerLayer.registerCollidable(player);
        itemLayer.registerCollidable(coin);
        
        var score = 0;
        var scoreLayer = game.createLayer("score");
        scoreLayer.static = true;

        enemyLayer.redraw = true;
        
        game.loadAndRun(function (elapsedTime, dt) {

            

            enemyLayer.redraw = true;
            enemyLayer.visible = true;

            enemies.forEach(function(enemy) {
                enemy.visible = true;
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
                enemyLayer.draw();
            });

            enemyLayer.draw();

            console.log("nope here");
        });
    }
}