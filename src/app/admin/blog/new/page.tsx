import { redirect } from "next/navigation";

export default function BlogNewRedirect() {
  redirect("/admin/blog/new/edit");
}
