function Map(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.tiles = [];
}

/*
 * Create a 2D array for our map
 * */
Map.prototype.create = function(default_value) {
    if (default_value == null) {
        default_value = 0;
    }

    var grid = [];
    for (var y=0; y<this.cols; y++) {
        var rows = [];
        for (var x=0; x<this.rows; x++) {
            rows.push(default_value);
        }
        grid.push(rows);
    }
    return grid;
};

/*
 * Fill the map with some starting cell as active
 * */
Map.prototype.fill = function(grid, chanceToStartAlive) {
    for (var y=0; y<this.cols; y++) {
        for (var x=0; x<this.rows; x++) {
            if (game.rnd.integerInRange(0, 100) < chanceToStartAlive) {
                grid[y][x] = 1;
            }
        }
    }

    return grid;
}

/*
 * Apply the Conway's law to the map
 * */
Map.prototype.simulate = function(grid) {
    var deathLimit = 3;
    var birthLimit = 4;

    var new_grid = this.create();

    for (var y=0; y<this.cols; y++) {
        for (var x=0; x<this.rows; x++) {
            var count = this.countNeighbours(grid, x, y);

            if (grid[y][x] == 1) {
                new_grid[y][x] = (count < deathLimit ? 0 : 1);
            } else {
                new_grid[y][x] = (count > birthLimit ? 1 : 0);
            }
        }
    }

    return new_grid;
};

/*
 * Get the total of active neighbours to a cell
 * */
Map.prototype.countNeighbours = function(map, x1, y1) {
    var count = 0;

    for (var y2=-1; y2<=1; y2++) {
        for (var x2=-1; x2<=1; x2++) {
            var nx = x1 + x2;
            var ny = y1 + y2;

            if (x2 != 0 || y2 != 0) {
                if (nx < 0 || ny < 0 || nx >= this.rows || ny >= this.cols || map[ny][nx] == 1) {
                    count++;
                }
            }
        }
    }

    return count;
};

/*
 * Generate the map with trees and castles
 * */
Map.prototype.generate = function() {
    var floor = this.create();
    floor = this.fill(floor, 45);

    var maxSimulations = 10;
    while (maxSimulations-- > 0) {
        var new_floor = this.simulate(floor);
        if (new_floor == floor) {
            break;
        }
        floor = new_floor;
    }

    var tree = this.create();
    tree = this.fill(tree, 45);
    tree = this.simulate(tree);

    var castles_grid = this.create(-1);

    this.castles = [];
    var nbr_castles = game.rnd.integerInRange(10, 20);
    for (var i=0; i<nbr_castles; i++) {
        var castle = {};
        castle.reinforcement = game.rnd.integerInRange(0, 3) + 9;
        castle.army = (castle.reinforcement * 6) + 20;
        castle.player = (i < 2);

        do {
            var x = game.rnd.integerInRange(0, 19);
            var y = game.rnd.integerInRange(0, 19);
        } while (floor[y][x] != 1 || tree[y][x] == 0 || castles_grid[y][x] >= 0);

        castle.x = x;
        castle.y = y;
        castles_grid[y][x] = this.castles.length;

        this.castles.push(castle);
    }

    this.grid = {'floor':floor, 'trees':tree, 'castles':castles_grid};
};

/*
 * Draw the map in a container
 * */
Map.prototype.draw = function(container) {
    for (var y=0; y<this.cols; y++) {
        var rows = [];
        for (var x=0; x<this.rows; x++) {
            var tile = container.create((x*16)+8, (y*16)+8, (this.grid.floor[y][x] == 1 ? 'grass' : 'water')); 

            tile.anchor.setTo(0.5, 0.5);
            tile.inputEnabled = true;
            tile.events.onInputDown.add(this.onTileClicked, this);

            tile.gridX = x;
            tile.gridY = y;

            tile.walkable = (this.grid.floor[y][x] == 1);

            if (tile.walkable && this.grid.trees[y][x] == 0) {
                tile.tree = container.create((x*16)+8, (y*16)+8, 'tree');
                tile.tree.anchor.setTo(0.5, 0.5);
            }

            if (this.grid.castles[y][x] >= 0 ) {
                tile.castle = container.create((x*16)+8, (y*16)+8, this.castles[this.grid.castles[y][x]].player ? 'castle' : 'house');
                tile.castle.anchor.setTo(0.5, 0.5);
            }

            rows.push(tile);
        }
        this.tiles.push(rows);
    }
};

/*
 * Helper to determine if it's empty at a location
 * */
Map.prototype.isEmpty = function(x, y) {

    if (!this.tiles[y][x].isWalkable) {
        return false;
    }
    if (this.trees[y][x] == 0) {
        return false;
    }
    return true;
}

/*
 * Event when a tile is clicked
 * */
Map.prototype.onTileClicked = function(tile, pointer) {
    var event = new CustomEvent("TileClicked");
    event.initCustomEvent("TileClicked", true, true, {'tile':tile});
    window.dispatchEvent(event);
}
