"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ref, update } from "firebase/database"
import { database } from "@/lib/firebase"
import type { FirebaseObject } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface EditObjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  object: FirebaseObject | null
}

const CONDITION_OPTIONS = ["Bad", "Good", "Maintenance"]

export function EditObjectDialog({ open, onOpenChange, object }: EditObjectDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<FirebaseObject, "id">>({
    condition: "",
    description: "",
    objectDisplayName: "",
    partNumber: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (object) {
      setFormData({
        condition: object.condition,
        description: object.description,
        objectDisplayName: object.objectDisplayName,
        partNumber: object.partNumber,
      })
    }
  }, [object, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      condition: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!object) return

    if (!formData.objectDisplayName || !formData.condition || !formData.partNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const objectRef = ref(database, `toyota/${object.id}`)
      await update(objectRef, formData)

      toast({
        title: "Success",
        description: "Equipment updated successfully",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating object:", error)
      toast({
        title: "Error",
        description: "Failed to update equipment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>Update the equipment details below</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-id">ID (Read-only)</Label>
            <Input id="edit-id" value={object?.id || ""} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-objectDisplayName">Display Name *</Label>
            <Input
              id="edit-objectDisplayName"
              name="objectDisplayName"
              value={formData.objectDisplayName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-condition">Condition *</Label>
            <select
              id="edit-condition"
              name="condition"
              value={formData.condition}
              onChange={handleConditionChange}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Select a condition</option>
              {CONDITION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-partNumber">Part Number *</Label>
            <Input
              id="edit-partNumber"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
