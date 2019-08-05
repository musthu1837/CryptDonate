module.exports = function timeDifference(previous) {
    previous = previous*1000;
    var current = new Date().getTime();
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.floor(elapsed/1000) + ' sec ago ';
    }

    else if (elapsed < msPerHour) {
         return Math.floor(elapsed/msPerMinute) + ' min ago ';
    }

    else if (elapsed < msPerDay ) {
         return Math.floor(elapsed/msPerHour ) + ' h '
         + Math.floor((elapsed%msPerHour)/msPerMinute ) + 'min ago';
    }

    else if (elapsed < msPerMonth) {
         return Math.floor(elapsed/msPerDay)+ 'd '
         + Math.floor((elapsed%msPerDay)/msPerHour)+ 'h '
         + Math.floor(((elapsed%msPerDay)%msPerHour)/msPerMinute)+ 'min ago';
    }

    else if (elapsed < msPerYear) {
        return Math.floor(elapsed/msPerMonth) + 'm '
        + Math.floor((elapsed%msPerMonth)/msPerDay) + 'd ';
        + Math.floor(((elapsed%msPerMonth)%msPerDay)/msPerHour) + 'hours ago ';
    }

    else {
        return Math.floor(elapsed/msPerYear ) + 'y '
        + Math.floor((elapsed%msPerYear)/msPerMonth) + 'm ';
        + Math.floor(((elapsed%msPerYear)%msPerMonth)/msPerDay) + 'd ';
        + Math.floor((((elapsed%msPerYear)%msPerMonth)%msPerDay)/msPerHour) + 'hours ago ';
    }
}
