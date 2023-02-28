import {isAllowed} from '../utility'
import {ModalRoleEnums} from 'type/user/roles'

export type NavigationItem = {
  id: string
  image: string
  separator?: boolean
  title: string
  url: string
  pushState?: boolean
  purple?: boolean
}

interface INavigationItemWithFilter extends NavigationItem {
  roles?: ModalRoleEnums[]
}

const separatorImgAddress = 'public/img/icon/line.svg'

const navigationItems: INavigationItemWithFilter[] = [
  {
    id: 'Setting',
    title: '',
    roles: [ModalRoleEnums.Administrator],
    url: '',
    image: separatorImgAddress,
    separator: true,
    purple: false
  }
]

const getFilteredNavigation = (roles: ModalRoleEnums[]): NavigationItem[] =>
  navigationItems
    .filter((item) => isAllowed(item.roles, roles))
    .map((item) => ({
      id: item.id,
      image: item.image,
      separator: item.separator,
      title: item.title,
      url: item.url,
      pushState: item.pushState,
      purple: item.purple
    }))

export {getFilteredNavigation}
