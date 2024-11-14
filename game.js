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

        var enemies = []
        var enemyLayer = game.createLayer('enemies');
        enemyLayer.redraw = true;
        var enemy = enemyLayer.createEntity();
        enemy.pos = { x: 250, y: 250 };
        enemy.velocity = { x: 100, y: 100 };
        enemy.size = { width: 40, height: 40 };
        enemy.asset = new PixelJS.AnimatedSprite();
        enemy.asset.prepare({
            name: 'pixil-frame-0.png',
            frames: 1,
            rows: 1,
            speed: 80,
            defaultFrame: 0
        });
        enemies.push(enemy);

        function tryNewEnemy() {
            var newEnemy = enemyLayer.createEntity()
            newEnemy.pos = { x: 250, y: 250 };
            newEnemy.velocity = { x: -100, y: -100 };
            newEnemy.size = { width: 40, height: 40 };
            newEnemy.asset = new PixelJS.AnimatedSprite();
            newEnemy.asset.prepare({
                name: 'pixil-frame-0.png',
                frames: 1,
                rows: 1,
                speed: 80,
                defaultFrame: 0
            });    
            enemyLayer.registerCollidable(newEnemy);
            enemies.push(newEnemy);
            enemyLayer.redraw = true; // Added here to force redraw
            newEnemy.visible = true;
        }    
        
        tryNewEnemy();

        setInterval(tryNewEnemy, 1000);

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
        enemyLayer.registerCollidable(enemy);
        
        var score = 0;
        var scoreLayer = game.createLayer("score");
        scoreLayer.static = true;

        enemyLayer.redraw = true;
        
        game.loadAndRun(function (elapsedTime, dt) {

            enemyLayer.redraw = true;
            enemyLayer.visible = true;

            enemies.forEach(function(enemy) {
                enemy.visible = true;
                console.log(`Enemy position: ${enemy.pos.x}, ${enemy.pos.y}`);
                enemy.pos.x += enemy.velocity.x * dt;
                enemy.pos.y += enemy.velocity.y * dt;
                if (enemy.pos.x <= -120 || enemy.pos.x >= 650) {
                    enemy.velocity.x = -enemy.velocity.x;
                }
                if (enemy.pos.y <= -120 || enemy.pos.y >= 450) {
                    enemy.velocity.y = -enemy.velocity.y;
                }
                enemyLayer.draw();
            });

            enemyLayer.draw();

            console.log("nope here");
        });
    }
}