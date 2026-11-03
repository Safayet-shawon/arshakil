import type { Metadata } from "next";
import Login from "@/components/admin/Login";
import Panel from "@/components/admin/Panel";
import { isAdmin } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; new?: string }> }) {
  const { tab, new: add } = await searchParams;
  return (await isAdmin()) ? <Panel startTab={tab} startNew={add === "1"} /> : <Login />;
}
