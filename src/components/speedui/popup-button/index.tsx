import React, { createRef, Fragment } from 'react'
import Button, { EIconPosition, ESize, EVariant } from '../button'
import Popup, { EPopupAnchorPosition } from '../popup'

export interface IPopupButtonProps {
    label: string
    popupPosition?: EPopupAnchorPosition
    iconName?: string
    iconPosition?: EIconPosition
    variant?: EVariant
    className?: string
    size?: ESize
    disabled?: boolean
    tooltip?: string
    tooltipPosition?: EPopupAnchorPosition
    onBeforeOpen: ((e: React.SyntheticEvent) => void)
    allowScroll?: boolean
}

interface IPopupButtonState {
    isPopupOpen: boolean
}

export default class PopupButton extends React.Component<IPopupButtonProps, IPopupButtonState> {
    protected refButton: React.RefObject<Button> = createRef()

    constructor(props: IPopupButtonProps) {
        super(props)
        this.state = { isPopupOpen: false }
    }

    public render() {
        const { children, className, disabled, iconName, iconPosition, label, size, tooltip, tooltipPosition, variant, popupPosition } = this.props
        const attributes = { className, disabled, iconName, iconPosition, label, size, tooltip, tooltipPosition, variant }
        return (
            <Fragment>
                <Button {...attributes} handleClick={this.showPopup} ref={this.refButton} />
                <Popup allowScroll={this.props.allowScroll} onClose={this.hidePopup} open={this.state.isPopupOpen} anchor={{ element: this.refButton.current && this.refButton.current.getHTMLElement(), position: popupPosition as EPopupAnchorPosition }}>
                    {children}
                </Popup>
            </Fragment>
        )
    }

    private showPopup = (e: React.SyntheticEvent) => {
        this.props.onBeforeOpen(e)
        this.setState({ isPopupOpen: true })
    }

    private hidePopup = () => this.setState({ isPopupOpen: false })
}
