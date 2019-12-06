module.exports = {
    getTrackIdsFromPlaylist: function(data) {
        let trackIds = []
        for (key in data) {
            trackIds.push(data[key]["track"]["id"]);
        }
        return trackIds;
    },

    getAllPlaylists: function(playlist1, playlist2, playlist3) {
        let playlists = []
        if (playlist1 != 0) {
            playlists.push(playlist1)
        }
        if (playlist2 != 0) {
            playlists.push(playlist2)
        }
        if (playlist3 != 0) {
            playlists.push(playlist3)
        }
        return playlists
    }
}