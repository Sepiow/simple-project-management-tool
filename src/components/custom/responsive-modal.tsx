import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ResponsiveModalProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange
}: 

ResponsiveModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false} 
        className="w-full max-w-lg p-0 border-none overflow-y-auto max-h-[85vh]">
        {children}
      </DialogContent>
    </Dialog>
  )
}