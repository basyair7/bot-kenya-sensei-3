import { category } from '../../utils'
import ping from './ping'
import mukaku from './mukaku'
import stats from './stats'
import says from './says'
import servericon from "./servericon"
import google from "./google"
import help from "./help"

export default category('Stable', [
  ping,
  stats,
  mukaku,
  says,
  servericon,
  google,
  help,
])