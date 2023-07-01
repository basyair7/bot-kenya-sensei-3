export function DateTimeBot() {
    var { DateTime } = require("luxon");
    var local = DateTime.local();
    var rezonedString = local.setZone("Asia/Jakarta");

    // get Date
    let year = rezonedString.c.year;
    let month = rezonedString.c.month;
    let day = rezonedString.c.day;

    // get Time
    let hour = rezonedString.c.hour;
    let minute = rezonedString.c.minute;
    let second = rezonedString.c.second;

    let datetime = year + "/" + month + "/" + day + " (" + hour + ":" + minute + ":" + second + ")";

    return datetime;
}