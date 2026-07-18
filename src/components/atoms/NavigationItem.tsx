type Props = {
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  // icon: React.ReactNode
  // Todo: ComponentType vs ReactNode
}

const NavigationItem = (props: Props) => {
  const { icon: Icon } = props

  return (
    <div>
      <Icon />
    </div>
  )
}

export default NavigationItem
