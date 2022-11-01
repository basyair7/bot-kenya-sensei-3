import { category } from '../../utils'
import ping from './ping'
import mukaku from './mukaku';
import stats from './stats'
import says from './says'

export default category('Debug', [
  ping,
  stats,
  mukaku,
  says,
])