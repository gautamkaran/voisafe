import { Skeleton } from "@/components/ui/Skeleton"

export function ComplaintListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-gray-200">
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-200">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <ComplaintListSkeleton />
    </div>
  )
}
