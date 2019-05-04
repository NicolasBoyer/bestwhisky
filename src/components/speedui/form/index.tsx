import React from 'react'
import Field, { EFieldType } from '../field'
import styles from './form.module.css'

export interface IFormInput {
    label: string
    name: string
    type: EFieldType
    pattern?: string
    required?: boolean
    placeHolder?: string
    tables?: string
}

export interface IFormProps {
    inputs: IFormInput[]
    onChange: (e: React.SyntheticEvent) => void
    onLoad?: (e: React.SyntheticEvent) => void
    onSubmit: (e: React.SyntheticEvent) => void
    datas?: any
}

export default class Form extends React.Component<IFormProps> {
    protected refFirstInput: React.RefObject<Field> = React.createRef()

    componentDidMount = () => this.refFirstInput.current && this.refFirstInput.current.focus()

    public render() {
        const { datas, inputs, onChange, onLoad, onSubmit } = this.props
        return (
            <form onLoad={onLoad} className={styles.form} onSubmit={onSubmit} autoComplete='off'>
                {inputs.map((input: IFormInput, index: number) =>
                    <Field label={input.label} name={input.name} type={input.type} placeHolder={input.placeHolder} required={input.required} pattern={input.pattern} onChange={onChange} ref={index === 0 ? this.refFirstInput : ''} key={index} value={datas && datas[input.name]} />
                )}
            </form>
        )
    }
}
