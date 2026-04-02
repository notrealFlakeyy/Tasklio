export const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const;

export const DEFAULT_WEEKLY_HOURS = [
  { weekday: 0, enabled: false, startTime: "08:00", endTime: "16:00" },
  { weekday: 1, enabled: true, startTime: "08:00", endTime: "16:00" },
  { weekday: 2, enabled: true, startTime: "08:00", endTime: "16:00" },
  { weekday: 3, enabled: true, startTime: "08:00", endTime: "16:00" },
  { weekday: 4, enabled: true, startTime: "08:00", endTime: "16:00" },
  { weekday: 5, enabled: true, startTime: "08:00", endTime: "16:00" },
  { weekday: 6, enabled: false, startTime: "08:00", endTime: "16:00" },
] as const;

export const DASHBOARD_NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/services", label: "Services" },
  { href: "/dashboard/availability", label: "Hours" },
  { href: "/dashboard/bookings", label: "Calendar" },
  { href: "/dashboard/settings", label: "Business" },
] as const;

export const CUSTOMER_STATUS_OPTIONS = [
  { label: "Lead", value: "lead" },
  { label: "Active", value: "active" },
  { label: "VIP", value: "vip" },
  { label: "Inactive", value: "inactive" },
] as const;
