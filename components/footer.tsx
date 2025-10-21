export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-background py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <p>&copy; {currentYear} PT. Kreasi Kode Biner. All rights reserved.</p>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Equipment Management System</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
