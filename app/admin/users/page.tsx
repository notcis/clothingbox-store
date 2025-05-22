import { requireAdmin } from "@/auth-guard";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser, getAllusers } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Admin Users",
};

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  await requireAdmin();

  const { page = "1" } = await searchParams;

  const users = await getAllusers({ page: Number(page) });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Users</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge>Admin</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.totalPages && users.totalPages >= 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  );
}
