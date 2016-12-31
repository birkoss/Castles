var Menu = {
    preload: function() {
        /*
        game.scale.minWidth = 640;
        game.scale.minHeight = 480;
        game.scale.maxWidth = 1280;
        game.scale.maxHeight = 960;
        game.scale.pageAlignHorizontally = true;
        */
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.load.image('grass', './assets/images/grass.png');
    },
    create: function() {
        this.state.start('Game');
        this.add.button(0, 0, 'grass', this.startGame, this);
    },
    startGame: function() {
        this.state.start('Game');
    }
};
