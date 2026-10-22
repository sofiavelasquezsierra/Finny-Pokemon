// Mirrors the card front's layout so content doesn't jump when it loads
export default function CardSkeleton() {
  return (
    <div className="bg-card flex flex-col overflow-hidden rounded-xl">
      <div className="bg-muted aspect-[4/5] w-full motion-safe:animate-pulse" />
      <div className="flex flex-col items-center gap-2 p-4">
        <div className="bg-muted h-5 w-24 rounded motion-safe:animate-pulse" />
        <div className="bg-muted h-5 w-14 rounded-full motion-safe:animate-pulse" />
      </div>
    </div>
  )
}
