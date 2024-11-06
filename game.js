document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();
        game.init({
            container: 'game_container',
            width: 800,
            height: 600
        });

        // Fetch temperature from the server
        fetch('/weather')
            .then(response => response.json())
            .then(data => {
                const temperature = data.temperature; // Get the temperature value from the API response
                console.log("Current Temperature:", temperature);

                // Choose background based on the temperature
                let backgroundImage;
                if (temperature <= 20) {
                    backgroundImage = 'background1.png'; // 0-20°F
                } else if (temperature <= 40) {
                    backgroundImage = 'background2.png'; // 21-40°F
                } else if (temperature <= 60) {
                    backgroundImage = 'background3.png'; // 41-60°F
                } else if (temperature <= 80) {
                    backgroundImage = 'background4.png'; // 61-80°F
                } else {
                    backgroundImage = 'background5.png'; // 81-100°F
                }

                // Set the background image
                var backgroundLayer = game.createLayer('background');
                var grass = backgroundLayer.createEntity();
                backgroundLayer.static = true;
                grass.pos = { x: 0, y: 0 };
                grass.asset = new PixelJS.Tile();
                grass.asset.prepare({
                    name: backgroundImage,  // Set the background image based on the temperature
                    size: { width: 800, height: 600 }
                });

                // Add temperature display to the screen
                var tempLayer = game.createLayer('temperature');
                tempLayer.static = true;
                tempLayer.redraw = true;
                tempLayer.drawText(
                    `Temperature: ${temperature}°F`, // Show the temperature
                    50,
                    80,
                    '14pt "Trebuchet MS", Helvetica, sans-serif',
                    '#FFFFFF',
                    'left'
                );

                // Create a coin on the screen
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

                // Player setup
                var playerLayer = game.createLayer('players');
                var player = new PixelJS.Player();
                player.addToLayer(playerLayer);
                player.pos = { x: 200, y: 300 };
                player.size = { width: 32, height: 32 };
                player.velocity = { x: 100, y: 100 };
                player.asset = new PixelJS.AnimatedSprite();
                player.asset.prepare({
                    name: 'char.png',
                    frames: 3,
                    rows: 4,
                    speed: 100,
                    defaultFrame: 1
                });

                var collectSound = game.createSound('collect');
                collectSound.prepare({ name: 'coin.mp3' });

                var score = 0;
                var scoreLayer = game.createLayer("score");
                scoreLayer.static = true;

                // Update score display
                scoreLayer.redraw = true;
                scoreLayer.drawText(
                    'Coins: ' + score,
                    50,
                    50,
                    '14pt "Trebuchet MS", Helvetica, sans-serif',
                    '#FFFFFF',
                    'left'
                );

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

                // Register collidables
                playerLayer.registerCollidable(player);
                itemLayer.registerCollidable(coin);

                // Start the game
                game.loadAndRun(function (elapsedTime, dt) {
                });
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
            });
    }
}
