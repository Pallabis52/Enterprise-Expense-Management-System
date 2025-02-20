import { useState } from 'react'
import { Button } from "/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "/components/ui/alert-dialog"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"
import { Edit, Trash } from "lucide-react"

interface Expense {
  id: number
  description: string
  amount: number
  date: string
}

const initialExpenses: Expense[] = [
  { id: 1, description: "Groceries", amount: 150, date: "2023-10-01" },
  { id: 2, description: "Rent", amount: 1200, date: "2023-10-02" },
  { id: 3, description: "Utilities", amount: 200, date: "2023-10-03" },
]

export default function Dashboard() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const handleDelete = (expenseId: number) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId))
    setIsDeleteDialogOpen(false)
  }

  const handleSave = (updatedExpense: Expense) => {
    setExpenses(expenses.map(expense => (expense.id === updatedExpense.id ? updatedExpense : expense)))
    setEditingExpense(null)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map(expense => (
            <TableRow key={expense.id}>
              <TableCell>{expense.id}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleEdit(expense)} className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Expense</DialogTitle>
                      <DialogDescription>
                        Make changes to your expense details here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    {editingExpense && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          const formData = new FormData(e.currentTarget)
                          const updatedExpense: Expense = {
                            id: editingExpense.id,
                            description: formData.get('description') as string,
                            amount: parseFloat(formData.get('amount') as string),
                            date: formData.get('date') as string,
                          }
                          handleSave(updatedExpense)
                        }}
                        className="grid gap-4 py-4"
                      >
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            name="description"
                            defaultValue={editingExpense.description}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            defaultValue={editingExpense.amount.toString()}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date
                          </Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            defaultValue={editingExpense.date}
                            className="col-span-3"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the expense.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(expense.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}