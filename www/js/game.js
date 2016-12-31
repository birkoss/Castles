var mapWidth = 20;
var mapHeight = 20;

var Game = {
    preload: function() {
       game.load.image('grass', './assets/images/grass.png'); 
       game.load.image('water', './assets/images/water.png'); 
       game.load.image('castle', './assets/images/castle.png'); 
       game.load.image('tree', './assets/images/tree.png'); 
    },
    create: function() {
        var M = new Map();
        M.generate();
        this.tiles = this.createMap();
        this.tiles = this.fillMap(this.tiles, 45);

        var maxSimulations = 10;
        while (maxSimulations-- > 0) {
            var new_tiles = this.simulateMap(this.tiles);
            if (new_tiles == this.tiles) {
                console.log("Stuck...");
                break;
            }
            this.tiles = new_tiles;
        }

        this.trees = this.createMap();
        this.trees = this.fillMap(this.trees, 10);
        this.trees = this.simulateMap(this.trees);

        this.map = this.game.add.group();
        
        this.drawMap();
    },
    drawMap: function() {
        for (var y=0; y<mapHeight; y++) {
            for (var x=0; x<mapWidth; x++) {
                var tile = this.map.create((x*16)+8, (y*16)+8, (this.tiles[y][x] == 1 ? 'grass' : 'water'));

                tile.anchor.setTo(0.5, 0.5);
                tile.inputEnabled = true;
                tile.events.onInputDown.add(this.onTileDown, this);

                if (this.tiles[y][x] == 1 && this.trees[y][x] == 0) {
                    tile = this.map.create((x*16)+8, (y*16)+8, 'tree');
                    tile.anchor.setTo(0.5, 0.5);
                }
            }
        }
    },
    update: function() {

    },

    /*
     * Generate a 2D array for our map
     * */
    createMap: function() {
        var map = [];

        for (var y=0; y<mapHeight; y++) {
            var row = [];
            for (var x=0; x<mapWidth; x++) {
                row.push(0);
            }
            map.push(row);
        }

        return map;
    },

    /*
     * Fill the map with some starting cell active
     * */
    fillMap: function(map, chanceToStartAlive) {
        var chanceToStartAlive = 45;

        for (var y=0; y<mapHeight; y++) {
            for (var x=0; x<mapWidth; x++) {
                if (this.game.rnd.integerInRange(0, 100) < chanceToStartAlive) {
                    map[y][x] = 1;
                }
            }
        }

        return map;
    },

    /*
     * Apply the Conway's laws to the map
     * */
    simulateMap: function(map) {
        var deathLimit = 3;
        var birthLimit = 4;

        var new_map = this.createMap();

        for (var y=0; y<mapHeight; y++) {
            for (var x=0; x<mapWidth; x++) {
                var count = this.countNeighbours(map, x, y);
                // The current cell is alive ?
                if (map[y][x] == 1) {
                    new_map[y][x] = (count < deathLimit ? 0 : 1);
                } else {
                    new_map[y][x] = (count > birthLimit ? 1 : 0);
                }
            }
        }

        return new_map;
    },

    countNeighbours: function(map, x2, y2) {
        var count = 0;

        for (var y=-1; y<=1; y++) {
            for (var x=-1; x<=1; x++) {
                var nx = x + x2;
                var ny = y + y2;
                if (x != 0 || y != 0) {
                    if (nx < 0 || ny < 0 || nx >= mapWidth || ny >= mapHeight) {
                        count++;
                    } else if (map[ny][nx] == 1) {
                        count++;
                    }
                }
            }
        }

        return count;
    },
    
    onTileDown: function(tile, pointer) {
        //this.tiles = this.simulateMap(this.tiles);
        //this.drawMap();
        tile.alpha = 0.5;
    }
};
