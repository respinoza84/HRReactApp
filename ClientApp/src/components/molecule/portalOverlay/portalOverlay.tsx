import {Portal} from 'lib/atom/portal'
import {Overlay, OverlayProps} from '../overlay'

const PortalOverlay = (props: OverlayProps) => (
  <Portal>
    <Overlay {...props} />
  </Portal>
)

export {PortalOverlay}
