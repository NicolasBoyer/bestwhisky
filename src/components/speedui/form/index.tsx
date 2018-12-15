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
}

export interface IFormProps {
    inputs: IFormInput[]
    onChange: (e: React.SyntheticEvent) => void
    onSubmit: (e: React.SyntheticEvent) => void
}

export default class Form extends React.Component<IFormProps> {
    protected refFirstInput: React.RefObject<Field> = React.createRef()

    componentDidMount = () => this.refFirstInput.current && this.refFirstInput.current.focus()

    public render() {
        const { inputs, onChange, onSubmit } = this.props
        return (
            <form className={styles.form} onSubmit={onSubmit} autoComplete='off'>
                {inputs.map((input: IFormInput, index: number) =>
                    <Field label={input.label} name={input.name} type={input.type} placeHolder={input.placeHolder} required={input.required} pattern={input.pattern} onChange={onChange} ref={index === 0 ? this.refFirstInput : ''} key={index} />
                )}
            </form>
        )
    }
}
