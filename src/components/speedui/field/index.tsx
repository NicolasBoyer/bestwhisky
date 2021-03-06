import { Image } from 'cloudinary-react'
import { createRef } from 'react'
import Ink from 'react-ink'
import React from 'reactn'
import { cloudinary } from '../../../tools/config'
import Utils from '../../../tools/utils'
import Box, { EBoxPosition, EBoxType } from '../box'
import Icon from '../icon'
import Loader from '../loader'
import Score from '../score'
import { EToastType } from '../toast'
import styles from './field.module.css'

// TODO : Pensez à améliorer password et à finaliser les types non faits
export enum EFieldType { text = 'text', area = 'area', number = 'number', password = 'password', search = 'search', email = 'email', url = 'url', image = 'image', images = 'images', video = 'video', videos = 'videos', checkbox = 'checkbox', radio = 'radio', select = 'select', color = 'color', date = 'date', range = 'range', note = 'note' }

export interface IFieldProps {
    label?: string
    name: string
    type: EFieldType
    onChange: (e: React.SyntheticEvent) => void
    pattern?: string
    required?: boolean
    placeHolder?: string
    value?: string
    customProps?: any
    className?: string
    options?: Array<{ name: string, value: string }>
}

interface IFieldStates {
    previewImage: string
    isFileLoading: boolean
}

export default class Field extends React.Component<IFieldProps, IFieldStates> {
    protected refInput: React.RefObject<HTMLInputElement> = createRef()
    protected refTextArea: React.RefObject<HTMLTextAreaElement> = createRef()
    protected refRoot: React.RefObject<HTMLDivElement> = createRef()

    constructor(props: IFieldProps) {
        super(props)
        this.state = { previewImage: props.type === EFieldType.images || props.type === EFieldType.image ? props.value || cloudinary.defaultImage : '', isFileLoading: false }
    }

    public render() {
        const { className, customProps, label, name, placeHolder, pattern, required, type, value } = this.props
        const { isFileLoading, previewImage } = this.state
        let field = null
        switch (type) {
            case EFieldType.note:
                field = <Score onChange={this.onChange} required={required} note={Number(this.props.value)} {...customProps} />
                break
            case EFieldType.image:
            case EFieldType.images:
                const attributes: any = {}
                // if (type === EFieldType.images || type === EFieldType.video) {
                if (type === EFieldType.images) {
                    attributes.multiple = 'multiple'
                }
                field = <input tabIndex={0} aria-invalid='false' accept='image/*' {...attributes} {...customProps} id={name} type='file' onChange={this.uploadFile} required={required} ref={this.refInput} />
                break
            case EFieldType.video:
            case EFieldType.videos:
                return null
            case EFieldType.checkbox:
            case EFieldType.radio:
                field = <input tabIndex={0} aria-invalid='false' type={type} {...customProps} id={name} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} required={required} ref={this.refInput} />
            case EFieldType.text:
            case EFieldType.number:
            case EFieldType.password:
            case EFieldType.search:
            case EFieldType.email:
            case EFieldType.url:
                field = <input tabIndex={0} aria-invalid='false' id={name} type={type} placeholder={placeHolder} {...customProps} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} ref={this.refInput} required={required} pattern={pattern} />
                break
            case EFieldType.select:
                field = !this.props.options
                    ?
                    <div>Aucune option n'est délarée : dans un select, un attribut "options" du type "name: string, value: string" est nécessaire</div>
                    :
                    <select name={name} onChange={this.onChange} value={this.props.value} {...customProps}>
                        {this.props.options.map((option: any) => <option key={Utils.generateId()} value={option.value}>{option.name}</option>)}
                    </select>
                break
            case EFieldType.color:
            case EFieldType.date:
            case EFieldType.range:
                return null
            case EFieldType.area:
                field = <textarea tabIndex={0} aria-invalid='false' id={name} onChange={this.onChange} {...customProps} onFocus={this.onFocus} onBlur={this.onBlur} ref={this.refTextArea} rows={10}></textarea>
                break
        }

        return (
            <div className={(className ? className + ' ' : '') + styles[type] + ' ' + styles.field + (required ? ' ' + styles.required : '') + (type !== EFieldType.image && type !== EFieldType.images && value ? ' ' + styles.hasValue : '')} ref={this.refRoot}>
                {
                    type === EFieldType.select ? field :
                        <label htmlFor={name}>
                            {(type === EFieldType.checkbox || type === EFieldType.radio) && field}
                            <span>{label}</span>
                            {type === EFieldType.image || type === EFieldType.images ? <Icon className={styles.fileIcon} name='upload' /> : null}
                            {(type !== EFieldType.checkbox && type !== EFieldType.radio) && <Ink />}
                        </label>
                }
                {
                    (type !== EFieldType.select && type !== EFieldType.checkbox && type !== EFieldType.radio) &&
                    <Box type={EBoxType.inline} className={styles.inputContainer}>
                        {field}
                        {isFileLoading && <Box type={EBoxType.horizontal} position={EBoxPosition.center} className={styles.fileLoader}><div className={styles.fileLoaderBg}></div><Loader /></Box>}
                        {previewImage && <Image cloudName={cloudinary.cloudName} publicId={previewImage} width='140' crop='scale' />}
                    </Box>
                }
            </div>
        )
    }

    componentDidMount = () => {
        if (this.props.value) {
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
