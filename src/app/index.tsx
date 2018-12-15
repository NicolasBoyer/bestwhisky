import React, { Fragment } from 'react'
import Whisky, { IWhiskyProps } from '../components/bestwhisky/whisky'
import Footer from '../components/speedui/footer'
import FormDialog, { EMode } from '../components/speedui/form-dialog'
import Header from '../components/speedui/header'
import SubHeader from '../components/speedui/sub-header'
import { addWhiskyInputs } from '../tools/config'
import styles from './app.module.css'

// TODO : A lier avec Firebase
const whiskiesJSON: IWhiskyProps[] = [
    {
        createdBy: 'Nico',
        // comments: [],
        description: 'A tester pour le type !',
        id: '1',
        image: 'sample',
        // Pas sur de garder la key
        key: '1',
        name: 'REDBREAST 15 ans Single Pot Still 46%',
        origin: 'Irlande / Cork County',
        price: 87,
        size: 70,
        views: [
            {
                author: 'Nico',
                stars: 5,
                view: 'TextArea'
            },
            {
                author: 'Elendil',
                stars: 4
            },
            {
                author: 'Sylvain',
                stars: 4
            }
        ]
    },
    {
        createdBy: 'Nico',
        description: 'A tester pour le type !',
        id: '2',
        image: 'bike',
        key: '2',
        name: 'REDBREAST 12 ans Single Pot Still 40%',
        origin: 'Irlande / Cork County',
        price: 58,
        size: 70,
        views: [
            {
                author: 'Nico',
                stars: 3,
                view: 'TextArea'
            }
        ]
    },
    {
        createdBy: 'Nico',
        description: 'A tester pour le type !',
        id: '3',
        image: 'elephants',
        key: '3',
        name: 'REDBREAST 12 ans Single Pot Still 40%',
        origin: 'Irlande / Cork County',
        price: 58,
        size: 70,
        views: [
            {
                author: 'Nico',
                stars: 2,
                view: 'TextArea'
            }
        ]
    },
    {
        createdBy: 'Nico',
        description: 'A tester pour le type !',
        id: '4',
        image: 'sheep',
        key: '4',
        name: 'REDBREAST 12 ans Single Pot Still 40%',
        origin: 'Irlande / Cork County',
        price: 58,
        size: 70,
        views: [
            {
                author: 'Nico',
                stars: 4,
                view: 'TextArea'
            }
        ]
    }
]

interface IAppState {
    value: string
}

export default class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props)
        this.state = { value: '' }
    }

    public render() {
        return (
            <Fragment>
                {/* Ajouter name a afficher si néecessaire ... */}
                <Header />
                <main className={styles.main}>
                    {/* Disparait sur petits écrans */}
                    <SubHeader name='Best Whisky' />
                    <section className={styles.content}>
                        <FormDialog inputs={addWhiskyInputs} title='Ajouter un Whisky' mode={EMode.add} onSubmit={this.handleSubmit} onChange={this.handleChange} />
                        {/* <Sort /> */}
                        {whiskiesJSON.map((datas: IWhiskyProps) => <Whisky {...datas} />)}
                    </section>
                </main>
                <Footer />
            </Fragment>
        )
    }

    protected handleSubmit = (e: React.SyntheticEvent) => {
        alert('A name was submitted: ' + this.state.value)
        e.preventDefault()
    }

    protected handleChange = (e: React.SyntheticEvent) => {
        this.setState({ value: (e.target as HTMLInputElement).value })
    }
}
