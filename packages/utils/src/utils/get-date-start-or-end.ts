import moment from 'moment';
import { formatType } from '../constants/swap';

/**
 * @description
 * @author 高枫
 * @date 2021/02/23
 * @param {(string[] | undefined)} dates date数组
 * @param {number} type start还是end
 * @returns {*}  {(string | undefined)}
 */
const getDateStartOrEnd = (dates: string[] | undefined, type: number): string | undefined => {
  if (dates && dates.length > 0) {
    return moment(dates[type]).format(formatType);
  }
  return undefined;
};

export { getDateStartOrEnd };
