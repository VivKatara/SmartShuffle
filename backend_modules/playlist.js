module.exports = {
    getTrackIdsFromPlaylist: function(data) {
        let trackIds = []
        for (key in data) {
            trackIds.push(data[key]["track"]["id"]);
        }
        return trackIds;
    }
}