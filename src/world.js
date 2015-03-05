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

    async getBlock(location) {
        var absolute = getChunkCoords(location);
        var relative = getRelativeCoords(location);

        var chunk = await this.getChunk(absolute.x, absolute.y);
        var block = chunk.getBlock(relative.x, relative.y, relative.z);

        return block;
    }

    async setBlock(location, block) {
        var absolute = getChunkCoords(location);
        var relative = getRelativeCoords(location);

        var chunk = await this.getChunk(absolute.x, absolute.y);
        chunk.setBlock(relative.x, relative.y, relative.z, block);
    }

    async getChunk(x, y) {
        if(isChunkLoaded(x, y))
            return this.loadedChunks.get({ x, y });
        else
            return await this.loadChunk(x, y);
    }

    async loadChunk(x, y) {
        var chunk = await this.chunkProvider.load(x, y);
        this.loadedChunks.set({ x, y }, chunk);
        return chunk;
    }

    async unloadChunk(x, y) {
        if(!this.isChunkLoaded(x, y))
            return;
        await this.chunkProvider.save(x, y, this.loadedChunks.get({ x, y}));
        this.loadedChunks.delete({ x, y });
    }

    isChunkLoaded(x, y) {
        return this.loadedChunks.has({ x, y });
    }

}

module.exports = World;
