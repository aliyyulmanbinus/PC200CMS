"use client"

import type React from "react"

import { useState } from "react"
import { ref, push, set } from "firebase/database"
import { database } from "@/lib/firebase"
import type { FirebaseObjectInput } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface AddObjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CONDITION_OPTIONS = ["Bad", "Good", "Maintenance"]

export function AddObjectDialog({ open, onOpenChange }: AddObjectDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FirebaseObjectInput>({
    condition: "",
    description: "",
    objectDisplayName: "",
    partNumber: "",
  })
  const { toast } = useToast()

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
      const objectsRef = ref(database, "toyota")
      const newObjectRef = push(objectsRef)

      await set(newObjectRef, formData)

      toast({
        title: "Success",
        description: "Equipment added successfully",
      })

      setFormData({
        condition: "",
        description: "",
        objectDisplayName: "",
        partNumber: "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding object:", error)
      toast({
        title: "Error",
        description: "Failed to add equipment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
          <DialogDescription>Fill in the details to add a new equipment to your inventory</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="objectDisplayName">Display Name *</Label>
            <Input
              id="objectDisplayName"
              name="objectDisplayName"
              value={formData.objectDisplayName}
              onChange={handleInputChange}
              placeholder="e.g., Attachment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition *</Label>
            <select
              id="condition"
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
            <Label htmlFor="partNumber">Part Number *</Label>
            <Input
              id="partNumber"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleInputChange}
              placeholder="e.g., TR-ATT-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter equipment description"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
