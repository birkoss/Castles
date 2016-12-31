var mapWidth = 20;
var mapHeight = 20;

var Game = {
    preload: function() {
       game.load.image('grass', './assets/images/grass.png'); 
       game.load.image('water', './assets/images/water.png'); 
       game.load.image('castle', './assets/images/castle.png'); 
       game.load.image('tree', './assets/images/tree.png'); 
       game.load.image('house', './assets/images/house.png'); 
    },
    create: function() {
        var map = new Map(20, 20);
        map.generate();

        addEventListener("TileClicked", this.onMapClicked);

        this.map_container = this.game.add.group();
        map.draw(this.map_container);
    },
    update: function() {

    },

    onMapClicked: function(event) {
        console.log(event);
        event.detail.tile.alpha = 0.5;
    },

    onTileDown: function(tile, pointer) {
        //this.tiles = this.simulateMap(this.tiles);
        //this.drawMap();
        tile.alpha = 0.5;
    }
};
