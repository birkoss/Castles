var game = new Phaser.Game(320, 480, Phaser.AUTO, '');

game.state.add('Menu', Menu);
game.state.add('Game', Game);

game.state.start('Menu');
