import { DASHBOARD_PAGE_LINK } from "@/common/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

const orders = [
  { id: "ORD001", customer: "John Doe", date: "2023-05-01", total: 150.00, status: "Completed" },
  { id: "ORD002", customer: "Jane Smith", date: "2023-05-02", total: 275.50, status: "Processing" },
  { id: "ORD003", customer: "Bob Johnson", date: "2023-05-03", total: 99.99, status: "Shipped" },
  { id: "ORD004", customer: "Alice Williams", date: "2023-05-04", total: 199.99, status: "Pending" },
  { id: "ORD005", customer: "Charlie Brown", date: "2023-05-05", total: 349.95, status: "Completed" },
]

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button asChild>
          <Link href={`${DASHBOARD_PAGE_LINK}/orders/create`}>
            <Plus className="mr-2 h-4 w-4" /> Create an Order
          </Link>
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders" className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}