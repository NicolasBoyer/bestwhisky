import { Image } from 'cloudinary-react'
import React from 'react'
import Ink from 'react-ink'
import { cloudinary } from '../../../tools/config'
import Icon from '../icon'
import Loader from '../loader'
import Score from '../score'
import Toast, { EToastType } from '../toast'
import styles from './field.module.css'

// TODO : Pensez à améliorer password et à finaliser les types non faits
export enum EFieldType { text = 'text', area = 'area', number = 'number', password = 'password', search = 'search', email = 'email', url = 'url', image = 'image', images = 'images', video = 'video', videos = 'videos', checkbox = 'checkbox', radio = 'radio', select = 'select', color = 'color', date = 'date', range = 'range', note = 'note' }

export interface IFieldProps {
    label: string
    name: string
    type: EFieldType
    onChange: (e: React.SyntheticEvent) => void
    pattern?: string
    required?: boolean
    placeHolder?: string
}

interface IFieldStates {
    previewImage: string
    isFileLoading: boolean
    isToastOpen: boolean
    toastType: EToastType | undefined
    toastMessage: any
    toastAutoHideDuration?: number
    isToasCloseButton?: boolean
}

export default class Field extends React.Component<IFieldProps, IFieldStates> {
    protected refInput: React.RefObject<HTMLInputElement> = React.createRef()
    protected refTextArea: React.RefObject<HTMLTextAreaElement> = React.createRef()
    protected refRoot: React.RefObject<HTMLDivElement> = React.createRef()

    constructor(props: IFieldProps) {
        super(props)
        this.state = { previewImage: props.type === EFieldType.images || props.type === EFieldType.image ? 'BestWhisky/default' : '', isFileLoading: false, isToastOpen: false, toastMessage: '', toastType: undefined }
    }

    public render() {
        const { label, name, placeHolder, pattern, required, type } = this.props
        const { isFileLoading, isToasCloseButton, isToastOpen, previewImage, toastAutoHideDuration, toastType, toastMessage } = this.state
        let input = null
        switch (type) {
            case EFieldType.note:
                input = <Score maxScore={5} />
                break
            case EFieldType.image:
            case EFieldType.images:
                const attributes: any = {}
                // if (type === EFieldType.images || type === EFieldType.video) {
                if (type === EFieldType.images) {
                    attributes.multiple = 'multiple'
                }
                input = <input tabIndex={0} aria-invalid='false' accept='image/*' {...attributes} id={name} type='file' onChange={this.uploadFile} required={required} />
                break
            case EFieldType.video:
            case EFieldType.videos:
                return null
            case EFieldType.checkbox:
            case EFieldType.radio:
                return null
            case EFieldType.text:
            case EFieldType.number:
            case EFieldType.password:
            case EFieldType.search:
            case EFieldType.email:
            case EFieldType.url:
                // TODO : required et regexp à prendre en compte côté bouton de validation quand j'en serais là
                input = <input tabIndex={0} aria-invalid='false' id={name} type={type} placeholder={placeHolder} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} ref={this.refInput} required={required} pattern={pattern} />
                break
            case EFieldType.select:
            case EFieldType.color:
            case EFieldType.date:
            case EFieldType.range:
                return null
            case EFieldType.area:
                input = <textarea tabIndex={0} aria-invalid='false' id={name} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} ref={this.refTextArea} rows={10}></textarea>
                break
        }

        return (
            <div className={styles[type] + ' ' + styles.field + (required ? ' ' + styles.required : '')} ref={this.refRoot}>
                <label htmlFor={name}>
                    <span>{label}</span>
                    {type === EFieldType.image || type === EFieldType.images ? <Icon className={styles.fileIcon} name='upload' /> : null}
                    <Ink />
                </label>
                <div className={styles.inputContainer}>
                    {input}
                    {isFileLoading && <div className={styles.fileLoader}><div className={styles.fileLoaderBg}></div><Loader /></div>}
                    {previewImage && <Image cloudName='elendil' publicId={previewImage} width='140' crop='scale' />}
                </div>
                <Toast type={toastType} autoHideDuration={toastAutoHideDuration} open={isToastOpen} closeButton={isToasCloseButton}>{toastMessage}</Toast>
            </div>
        )
    }

    public focus = () => {
        if (this.refInput.current) {
            this.refInput.current.focus()
        }
        if (this.refTextArea.current) {
            this.refTextArea.current.focus()
        }
    }

    protected onFocus = () => this.refRoot.current && this.refRoot.current.classList.add(styles.focus)

    protected onBlur = () => this.refRoot.current && this.refRoot.current.classList.remove(styles.focus)

    protected onChange = (e: React.SyntheticEvent) => {
        if (this.refRoot.current) {
            if (this.refInput.current && this.refInput.current.value !== '') {
                this.refRoot.current.classList.add(styles.hasValue)
                // Email / pattern / url validation
                const validRegExp = this.props.pattern && new RegExp(this.props.pattern)
                const validUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
                const validEmail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
                if (!validEmail.test(this.refInput.current.value) && this.props.type === EFieldType.email || validRegExp && !validRegExp.test(this.refInput.current.value) || !validUrl.test(this.refInput.current.value) && this.props.type === EFieldType.url) {
                    this.refRoot.current.classList.add(styles.error)
                } else {
                    this.refRoot.current.classList.remove(styles.error)
                }
            } else if (this.refTextArea.current && this.refTextArea.current.value !== '') {
                this.refRoot.current.classList.add(styles.hasValue)
            } else {
                this.refRoot.current.classList.remove(styles.hasValue)
                this.refRoot.current.classList.remove(styles.error)
            }
        }
        this.props.onChange(e)
    }

    protected uploadFile = (e: React.SyntheticEvent) => {
        const files = (e.target as HTMLInputElement).files as FileList
        [].forEach.call(files, async (file: File) => {
            const formData = new FormData()
            this.setState({ isFileLoading: true })
            formData.append('upload_preset', cloudinary.uploadPreset)
            formData.append('file', file)
            const response = await fetch('https://api.cloudinary.com/v1_1/' + cloudinary.cloudName + '/upload', { body: formData, method: 'POST' })
            const success = await response.json()
            if (success.error) {
                this.setState({ isToastOpen: true, toastMessage: 'Erreur : ' + success.error.message, toastType: EToastType.error, isToasCloseButton: true })
                console.error(success.error)
                return false
            }
            this.setState({ previewImage: success.public_id, isFileLoading: false, isToastOpen: true, toastMessage: 'Succès : votre image a bien été envoyée', toastType: EToastType.success, toastAutoHideDuration: 3 })
        })
        this.props.onChange(e)
    }
}
