import Link from 'next/link'

const TOKEN_REGEX = /(#[\p{L}0-9_]+)|(@[\p{L}0-9_]+)|(https?:\/\/[^\s]+)/gu

export function linkifyCaption(
  text: string,
  linkClassName = 'text-blue-600 font-medium',
): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null

  TOKEN_REGEX.lastIndex = 0
  while ((match = TOKEN_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const [full, hashtag, mention, url] = match

    if (hashtag) {
      nodes.push(
        <Link
          key={key++}
          href={`/explore/tags/${encodeURIComponent(hashtag.slice(1))}`}
          className={linkClassName}
        >
          {hashtag}
        </Link>,
      )
    } else if (mention) {
      nodes.push(
        <Link
          key={key++}
          href={`/u/${encodeURIComponent(mention.slice(1))}`}
          className={linkClassName}
        >
          {mention}
        </Link>,
      )
    } else if (url) {
      nodes.push(
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClassName} underline break-all`}
        >
          {url}
        </a>,
      )
    }

    lastIndex = match.index + full.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}
