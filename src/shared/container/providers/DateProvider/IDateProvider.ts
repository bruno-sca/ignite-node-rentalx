interface IDateProvider {
  secondDiff(start_date: Date, end_date: Date): number;
  hourDiff(start_date: Date, end_date: Date): number;
  daysDiff(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  addDays(days: number): Date;
}

export { IDateProvider };
