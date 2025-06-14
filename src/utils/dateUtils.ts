
import { subDays, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

export const calculateReservationOpenDate = (date: Date): Date => {
  const threeDaysBefore = subDays(date, 3);
  const at8AM = setHours(threeDaysBefore, 8);
  const at8AM_0min = setMinutes(at8AM, 0);
  const at8AM_0min_0sec = setSeconds(at8AM_0min, 0);
  return setMilliseconds(at8AM_0min_0sec, 0);
};
