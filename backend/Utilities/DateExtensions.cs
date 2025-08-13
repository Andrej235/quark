namespace Quark.Utilities
{
    public static class DateExtensions
    {
        public static DateTime GetStartOfWeek(this DateTime date)
        {
            int diff = (date.DayOfWeek - DayOfWeek.Sunday) % 7;
            return date.AddDays(-diff).Date;
        }

        public static DateTime AsUTC(this DateTime date) =>
            DateTime.SpecifyKind(date, DateTimeKind.Utc);
    }
}
