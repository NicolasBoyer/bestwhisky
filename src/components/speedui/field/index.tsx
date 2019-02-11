import { Image } from 'cloudinary-react'
import { createRef } from 'react'
import Ink from 'react-ink'
import React from 'reactn'
import { cloudinary } from '../../../tools/config'
import Utils from '../../../tools/utils'
import Icon from '../icon'
import Loader from '../loader'
import Score from '../score'
import { EToastType } from '../toast'
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
    value?: string
}

interface IFieldStates {
    previewImage: string
    isFileLoading: boolean
}

export default class Field extends React.Component<IFieldProps, IFieldStates> {
    protected refScore: React.RefObject<Score> = createRef()
    protected refInput: React.RefObject<HTMLInputElement> = createRef()
    protected refTextArea: React.RefObject<HTMLTextAreaElement> = createRef()
    protected refRoot: React.RefObject<HTMLDivElement> = createRef()

    constructor(props: IFieldProps) {
        super(props)
        this.state = { previewImage: props.type === EFieldType.images || props.type === EFieldType.image ? props.value || cloudinary.defaultImage : '', isFileLoading: false }
    }

    public render() {
        const { label, name, placeHolder, pattern, required, type, value } = this.props
        const { isFileLoading, previewImage } = this.state
        let input = null
        switch (type) {
            case EFieldType.note:
                input = <Score maxScore={5} onChange={this.onChange} required={required} ref={this.refScore} />
                break
            case EFieldType.image:
            case EFieldType.images:
                const attributes: any = {}
                // if (type === EFieldType.images || type === EFieldType.video) {
                if (type === EFieldType.images) {
                    attributes.multiple = 'multiple'
                }
                input = <input tabIndex={0} aria-invalid='false' accept='image/*' {...attributes} id={name} type='file' onChange={this.uploadFile} required={required} ref={this.refInput} />
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
            <div className={styles[type] + ' ' + styles.field + (required ? ' ' + styles.required : '') + (type !== EFieldType.image && type !== EFieldType.images && value ? ' ' + styles.hasValue : '')} ref={this.refRoot}>
                <label htmlFor={name}>
                    <span>{label}</span>
                    {type === EFieldType.image || type === EFieldType.images ? <Icon className={styles.fileIcon} name='upload' /> : null}
                    <Ink />
                </label>
                <div className={styles.inputContainer}>
                    {input}
                    {isFileLoading && <div className={styles.fileLoader}><div className={styles.fileLoaderBg}></div><Loader /></div>}
                    {previewImage && <Image cloudName={cloudinary.cloudName} publicId={previewImage} width='140' crop='scale' />}
                </div>
            </div>
        )
    }

    componentDidMount = () => {
        if (this.props.value) {
            if (this.refScore.current) {
                this.refScore.current.setValue(this.props.value as string)
            }
            if (this.refInput.current) {
                if (this.refInput.current.type === 'file') {
                    this.refInput.current.setAttribute('data-cloudId', this.props.value as string)
                } else {
                    this.refInput.current.value = this.props.value as string
                }
            }
            if (this.refTextArea.current) {
                this.refTextArea.current.value = this.props.value as string
            }
        }
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
                // Email / pattern / url / password validation
                if (!Utils.isValidField(this.refInput.current)) {
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
        const input = e.target as HTMLInputElement
        const files = input.files as FileList
        [].forEach.call(files, async (file: File) => {
            const formData = new FormData()
            this.setState({ isFileLoading: true })
            formData.append('upload_preset', cloudinary.uploadPreset)
            formData.append('file', file)
            const response = await fetch(cloudinary.url + cloudinary.cloudName + '/upload', { body: formData, method: 'POST' })
            const success = await response.json()
            if (success.error) {
                this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + success.error.message, toastType: EToastType.error, isToastCloseButton: true } })
                console.error(success.error)
                return false
            }
            const cloudId = success.public_id
            input.setAttribute('data-cloudId', cloudId)
            this.setState({ previewImage: cloudId, isFileLoading: false })
            this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'Succès : votre image a bien été envoyée', toastType: EToastType.success, toastAutoHideDuration: 3 } })
        })
        this.props.onChange(e)
    }
}
