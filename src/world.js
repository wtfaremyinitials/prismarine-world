var Chunk = require('prismarine-chunk');

var getChunkCoords = function(location) {
    return {
        x: Math.floor(location.x / 16),
        z: Math.floor(location.z / 16)
    };
};

var getRelativeCoords = function(location) {
    return {
        x: location.x % 16,
        y: location.y,
        z: location.z % 16
    };
};

class World {

    constuctor(chunkProvider) {
        this.chunkProvider = chunkProvider;
        this.loadedChunks  = new Map();
    }

    getBlock(location, cb) {
        var absolute = getChunkCoords(location);
        var relative = getRelativeCoords(location);

        this.getChunk(absolute.x, absolute.z, function(chunk) {
            cb(chunk.getBlock(relative.x, relative.y, relative.z));
        });
    }

    setBlock(location, block, cb) {
        var absolute = getChunkCoords(location);
        var relative = getRelativeCoords(location);

        this.getChunk(absolute.x, absolute.z, function(chunk) {
            chunk.setBlock(relative.x, relative.y, relative.z, block);
            cb();
        });
    }

    getChunk(x, y, cb) {
        var chunk = this.loadedChunks.get({ x, y });

        if(this.isChunkLoaded(x, y))
            cb(this.loadedChunks.get({ x, y }));
        else
            this.loadChunk(x, y, cb);
    }

    loadChunk(x, y, cb) {
        this.chunkProvider.load(x, y, function(chunk) {
            this.loadedChunks.set({ x, y }, chunk);
            cb(chunk);
        });
    }

    unloadChunk(x, y, cb) {
        if(!this.isChunkLoaded(x, y))
            return;
        this.chunkProvider.save(x, y, this.loadedChunks.get({ x, y}), cb);
        this.loadedChunks.delete({ x, y });
    }

    isChunkLoaded(x, y) {
        return this.loadedChunks.has({ x, y });
    }

}

module.exports = World;
