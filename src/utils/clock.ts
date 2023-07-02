import { DateTime } from "luxon";

export function DateTimeBot() {
    var local = DateTime.now();
    var rezonedString = local.setZone("Asia/Jakarta");

    // get Date
    let year = rezonedString.year;
    let month = rezonedString.month;
    let day = rezonedString.day;

    // get Time
    let hour = rezonedString.hour;
    let minute = rezonedString.minute;
    let second = rezonedString.second;

    let datetime = year + "/" + month + "/" + day + " (" + hour + ":" + minute + ":" + second + ")";

    return datetime;
}