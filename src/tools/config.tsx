import { EFieldType } from '../components/speedui/field'
import { IFormInput } from '../components/speedui/form'

export const cloudinary = {
    cloudName: 'elendil',
    uploadPreset: 'bestwhisky'
}

// export const loginInputs: IFormInput[] = [

// ]

// export const signInputs: IFormInput[] = [

// ]

export const addWhiskyInputs: IFormInput[] = [
    {
        label: 'Nom',
        name: 'name',
        required: true,
        type: EFieldType.text
    },
    {
        label: 'Description',
        name: 'description',
        type: EFieldType.area
    },
    {
        label: 'Choisir une image',
        name: 'image',
        type: EFieldType.image
    }
]
