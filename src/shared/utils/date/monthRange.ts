import dayjs from "dayjs";

type MonthRange = {
  month: string;
  startDate: string;
  endDate: string;
};

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function buildMonthRange(month?: string): MonthRange {
  const fallbackMonth = dayjs().format("YYYY-MM");
  const normalizedMonth = month ?? fallbackMonth;

  if (!MONTH_PATTERN.test(normalizedMonth)) {
    throw new Error("Invalid month format. Expected YYYY-MM");
  }

  const startDate = `${normalizedMonth}-01`;
  const endDate = dayjs(startDate).endOf("month").format("YYYY-MM-DD");

  return {
    month: normalizedMonth,
    startDate,
    endDate,
  };
}

