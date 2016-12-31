function Map(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.tiles = [];
}

/*
 * Create a 2D array for our map
 * */
Map.prototype.create = function() {
    var map = [];
    for (var y=0; y<this.cols; y++) {
        var rows = [];
        for (var x=0; x<this.rows; x++) {
            rows.push(0);
        }
        map.push(rows);
    }
    return map;
};

/*
 * Fill the map with some starting cell as active
 * */
Map.prototype.fill = function(map, chanceToStartAlive) {
    for (var y=0; y<this.cols; y++) {
        for (var x=0; x<this.rows; x++) {
            if (game.rnd.integerInRange(0, 100) < chanceToStartAlive) {
                map[y][x] = 1;
            }
        }
    }

    return map;
}

/*
 * Apply the Conway's law to the map
 * */
Map.prototype.simulate = function(map) {
    var deathLimit = 3;
    var birthLimit = 4;

    var new_map = this.create();

    for (var y=0; y<this.cols; y++) {
        for (var x=0; x<this.rows; x++) {
            var count = this.countNeighbours(map, x, y);

            if (map[y][x] == 1) {
                new_map[y][x] = (count < deathLimit ? 0 : 1);
            } else {
                new_map[y][x] = (count > birthLimit ? 1 : 0);
            }
        }
    }

    return new_map;
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

            if (x != 0 || y != 0) {
                if (nx < 0 || ny < 0 || nx >= this.rows || ny >= this.cols || map[ny][nx] == 1) {
                    count++;
                }
            }
        }
    }

    return count;
};

Map.prototype.generate = function() {
    console.log("OUI");
};
