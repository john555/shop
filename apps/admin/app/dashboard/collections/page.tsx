import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

const collections = [
  { id: 1, name: "Summer Collection", products: 15, status: "Active" },
  { id: 2, name: "Winter Essentials", products: 20, status: "Draft" },
  { id: 3, name: "Spring Sale", products: 10, status: "Active" },
  { id: 4, name: "Autumn Favorites", products: 18, status: "Active" },
  { id: 5, name: "Holiday Specials", products: 25, status: "Draft" },
]

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Collections</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Collection
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search collections" className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell className="font-medium">{collection.name}</TableCell>
              <TableCell>{collection.products}</TableCell>
              <TableCell>{collection.status}</TableCell>
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