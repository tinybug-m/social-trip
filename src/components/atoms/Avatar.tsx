interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: number
  ring?: boolean
}

const Avatar = ({ src, name, size = 32, ring = false }: AvatarProps) => {
  const inner = (
    <div
      className="h-full w-full rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden"
      style={ring ? undefined : { width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? 'avatar'}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="font-semibold text-neutral-500"
          style={{ fontSize: size * 0.4 }}
        >
          {name?.[0]?.toUpperCase() ?? '?'}
        </span>
      )}
    </div>
  )

  if (!ring) return inner

  return (
    <div
      className="rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]"
      style={{ width: size, height: size }}
    >
      <div className="h-full w-full rounded-full bg-white p-[2px]">{inner}</div>
    </div>
  )
}

export default Avatar
