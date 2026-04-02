import { redirect } from "next/navigation";

export default async function CustomerProfilePage() {
  redirect("/dashboard/bookings");
}
