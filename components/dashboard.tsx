"use client"

import type { FirebaseObject } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useMemo } from "react"

interface DashboardProps {
  objects: FirebaseObject[]
  loading: boolean
  onEdit: (object: FirebaseObject) => void
  onDelete: (object: FirebaseObject) => void
}

const ITEMS_PER_PAGE = 10

export function Dashboard({ objects, loading, onEdit, onDelete }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredObjects = useMemo(() => {
    if (!searchQuery.trim()) return objects
    return objects.filter((obj) => obj.objectDisplayName.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [objects, searchQuery])

  const totalPages = Math.ceil(filteredObjects.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedObjects = filteredObjects.slice(startIndex, endIndex)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (objects.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No equipment found. Create your first entry to get started.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4 w-full overflow-hidden">
      {/* Search Input */}
      <div className="flex gap-2 items-center w-full">
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by display name..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Found {filteredObjects.length} of {objects.length} equipment
        </p>
      )}

      {filteredObjects.length === 0 && searchQuery && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No equipment found matching "{searchQuery}"</p>
        </Card>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Display Name</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Condition</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Part Number</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedObjects.map((obj) => (
              <tr key={obj.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground font-mono text-sm">{obj.id}</td>
                <td className="py-3 px-4 text-foreground">{obj.objectDisplayName}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {obj.condition}
                  </span>
                </td>
                <td className="py-3 px-4 text-foreground font-mono text-sm">{obj.partNumber}</td>
                <td className="py-3 px-4 text-muted-foreground text-sm truncate max-w-xs">{obj.description}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(obj)} className="gap-2">
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(obj)} className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - CHANGE: Improved responsive layout with better spacing */}
      <div className="md:hidden space-y-3">
        {paginatedObjects.map((obj) => (
          <Card key={obj.id} className="p-3 sm:p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                    {obj.objectDisplayName}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">{obj.id}</p>
                </div>
                {/* CHANGE: Condition badge with better responsive sizing */}
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary flex-shrink-0">
                  {obj.condition}
                </span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="text-muted-foreground truncate">
                  <span className="font-semibold text-foreground">Part:</span> {obj.partNumber}
                </p>
                <p className="text-muted-foreground line-clamp-2">
                  <span className="font-semibold text-foreground">Desc:</span> {obj.description}
                </p>
              </div>
              {/* CHANGE: Action buttons with better mobile sizing and spacing */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(obj)}
                  className="flex-1 gap-1 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Pencil className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden xs:inline">Edit</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(obj)}
                  className="flex-1 gap-1 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden xs:inline">Delete</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination - CHANGE: Responsive pagination with compact mobile layout */}
      {filteredObjects.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredObjects.length)} of {filteredObjects.length}
          </p>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="gap-1 h-9 px-2 sm:px-3"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </Button>

            {/* Page Numbers - CHANGE: Show limited page numbers on mobile to prevent overflow */}
            <div className="flex gap-1">
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm"
                  >
                    {page}
                  </Button>
                ))
              ) : (
                // Show limited pages on mobile
                <>
                  {currentPage > 2 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm"
                      >
                        1
                      </Button>
                      {currentPage > 3 && <span className="text-muted-foreground">...</span>}
                    </>
                  )}
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => Math.max(1, currentPage - 1 + i))
                    .filter((page) => page <= totalPages)
                    .map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm"
                      >
                        {page}
                      </Button>
                    ))}
                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && <span className="text-muted-foreground">...</span>}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="gap-1 h-9 px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
