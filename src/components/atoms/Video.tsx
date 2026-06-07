type Props = {
  url: string
}

const Video = (props: Props) => {
  const { url } = props
  return <video src={url} autoPlay />
}

export default Video
