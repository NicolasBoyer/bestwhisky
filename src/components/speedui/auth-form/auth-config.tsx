import { EFieldType } from '../field'
import { IFormInput } from '../form'

// TODO : A passer dans config
export const signInInputs: IFormInput[] = [
    {
        label: 'Adresse email',
        name: 'email',
        required: true,
        type: EFieldType.email
    },
    {
        label: 'Password',
        name: 'password',
        type: EFieldType.password
    }
]
