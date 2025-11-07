"use client"

import { useState, useEffect } from "react"
import { ref, onValue, remove } from "firebase/database"
import { database } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import type { FirebaseObject } from "@/lib/types"
import { DashboardContent } from "@/components/dashboard-content"
import { AddObjectDialog } from "@/components/add-object-dialog"
import { EditObjectDialog } from "@/components/edit-object-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export function Dashboard() {
  const [toyota, setObjects] = useState<FirebaseObject[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedObject, setSelectedObject] = useState<FirebaseObject | null>(null)
  const { toast } = useToast()
  const { logout } = useAuth()

  useEffect(() => {
    const objectsRef = ref(database, "toyota")

    const unsubscribe = onValue(
      objectsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const objectsList = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          }))
          setObjects(objectsList)
        } else {
          setObjects([])
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching objects:", error)
        toast({
          title: "Error",
          description: "Failed to load objects from database",
          variant: "destructive",
        })
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [toast])

  const handleEdit = (object: FirebaseObject) => {
    setSelectedObject(object)
    setEditDialogOpen(true)
  }

  const handleDelete = (object: FirebaseObject) => {
    setSelectedObject(object)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedObject) return

    try {
      const objectRef = ref(database, `objects/${selectedObject.id}`)
      await remove(objectRef)
      toast({
        title: "Success",
        description: "Object deleted successfully",
      })
      setDeleteDialogOpen(false)
      setSelectedObject(null)
    } catch (error) {
      console.error("Error deleting object:", error)
      toast({
        title: "Error",
        description: "Failed to delete object",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">PC 200 CMS</h1>
              <p className="text-muted-foreground mt-2">Manage your equipment and parts inventory</p>
            </div>
            <AddObjectDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
          </div>

          <DashboardContent toyota={toyota} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </main>

      <Footer />

      <EditObjectDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} object={selectedObject} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        objectName={selectedObject?.objectDisplayName}
      />

      <Toaster />
    </div>
  )
}
