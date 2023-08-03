import { category } from '../../utils';
import ping from './ping';
import mukaku from './mukaku';
import stats from './stats';
import says from './says';
import servericon from './servericon';
import google from './google';
import help from './help';
// import uptime from './uptime';
import join from './join';
import left from './left';
import play from './music/play';
import stop from './music/stop';
import queue from './music/queue';
import skip from './music/skip';
import nowplay from './music/nowplay';
import loop from './music/loop';
import lyrics from './music/lyrics';
import remove from './music/remove';

export default category('Debug', [
  ping, stats, mukaku,
  says, servericon, google,
  help,
  // uptime,
  join, left, play,
  stop, queue, skip,
  nowplay, loop, lyrics,
  remove,
]);