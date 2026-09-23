import { UsersTable } from "@/components/admin/users-table";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { getCurrentUser } from "@/lib/auth";
import { getCustomers } from "@/lib/data/queries";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const [users, me] = await Promise.all([getCustomers(), getCurrentUser()]);

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Who can sign in, and who can reach this panel."
      />

      <div className="mb-6">
        <Card title="Creating the first administrator">
          <ol className="ml-5 list-decimal space-y-2 text-sm leading-relaxed text-ink-soft marker:text-ash">
            <li>
              Register an account on the storefront at <code className="bg-ivory-deep px-1">/account</code>{" "}
              with the email you want to use.
            </li>
            <li>
              Open the Supabase dashboard → Table editor → <code className="bg-ivory-deep px-1">profiles</code>.
            </li>
            <li>
              Find your row and set <code className="bg-ivory-deep px-1">is_admin</code> to{" "}
              <code className="bg-ivory-deep px-1">true</code> and{" "}
              <code className="bg-ivory-deep px-1">role</code> to{" "}
              <code className="bg-ivory-deep px-1">admin</code>.
            </li>
            <li>
              Sign in at <code className="bg-ivory-deep px-1">/admin/sign-in</code>. From then on you
              can promote other accounts from the table below.
            </li>
          </ol>
        </Card>
      </div>

      <UsersTable users={users} currentUserId={me?.id} />
    </>
  );
}
