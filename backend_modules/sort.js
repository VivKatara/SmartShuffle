module.exports = {
    //As of now, this just sorts on total score
    sort : function (tracks, index){
        var sort_index = index;
        var sorted_array = tracks.sort(function(a, b) {
            return a[sort_index] > b[sort_index] ? 1: -1;
        });
        var song_array = [];
        for (var i = 0; i < sorted_array.length;i++){
            var song = sorted_array[i][0];
            song_array.push(song);
        }
	    return song_array;
    },

    peakSort : function (peakElement, length, sorted_tracks) {
        let index = length - 1
        let sortedTracksByPeak = Array(length)
        let rightIndex = peakElement + 1
        let leftIndex = peakElement - 1
        sortedTracksByPeak[peakElement] = sorted_tracks[index]
        index -= 1
        while (index >= 0) {
            if (index >= 0 && rightIndex < length) {
                sortedTracksByPeak[rightIndex] = sorted_tracks[index]
                rightIndex += 1
                index -= 1
            }
            if (index >= 0 && leftIndex >= 0) {
                sortedTracksByPeak[leftIndex] = sorted_tracks[index]
                leftIndex -= 1
                index -= 1
            }
        }
        return sortedTracksByPeak
    },

    calculateTotalScore: function (trackIdsWithVars, weights) {
        let trackIdsWithWeights = []
        let track = 0
        let score = 0
        let trackValues = []
        let pushItem = []
        for (tuple in trackIdsWithVars) {
            track = trackIdsWithVars[tuple][0]
            trackValues = trackIdsWithVars[tuple][1]
            for (value in trackValues) {
                score += (trackValues[value] * weights[value])
            }
            pushItem = [track, score]
            trackIdsWithWeights.push(pushItem)
            score = 0;
        }
        return trackIdsWithWeights
    },

    createTrackScoreObject: function (trackIdsWithWeights) {
        trackScoreObject = {}
        let track = 0
        let score = 0
        for (tuple in trackIdsWithWeights) {
            track = trackIdsWithWeights[tuple][0]
            score = trackIdsWithWeights[tuple][1]
            trackScoreObject[track] = score
        }
        return trackScoreObject
    },

    addNameAndArtist: function (sortedTracks) {
        let tracksAndNameAndArtists = []
        let trackId = ""
        let name = ""
        let artist = ""
        for (track in sortedTracks) {
            trackId = sortedTracks[track]
            
        }
    }
}