import { Icon } from "@iconify/react"
import { IonNote } from "@ionic/react"

interface Props {
  backgroundColor: string
  foregroundColor: string
  icon: string
  iconSize?: number
}

const ListIcon: React.FC<Props> = (props: Props) => {
  return (
    <IonNote slot="start" class="mr-4">
      <div className='w-7 h-7 rounded-md flex flex-col relative' style={{backgroundColor: props.backgroundColor}}>
        <Icon icon={props.icon} color={props.foregroundColor} width={props.iconSize ?? 20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </IonNote>
  )
}

export default ListIcon