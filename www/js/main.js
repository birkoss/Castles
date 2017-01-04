var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '');

game.state.add('Menu', Menu);
game.state.add('Game', Game);

game.state.start('Menu');
