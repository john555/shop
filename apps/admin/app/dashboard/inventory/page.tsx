import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

const inventory = [
  { id: 1, name: "Wireless Earbuds", sku: "WE001", stock: 120, reorderPoint: 20 },
  { id: 2, name: "Smart Watch", sku: "SW002", stock: 50, reorderPoint: 15 },
  { id: 3, name: "Bluetooth Speaker", sku: "BS003", stock: 75, reorderPoint: 25 },
  { id: 4, name: "Laptop", sku: "LP004", stock: 30, reorderPoint: 10 },
  { id: 5, name: "Smartphone", sku: "SP005", stock: 60, reorderPoint: 20 },
]

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory" className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Reorder Point</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell>{item.reorderPoint}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}