import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from '../components/Card'


export default function Home() {
    const products = [
        {id: 1, title: 'Card 1', description: 'This is another card'},
        {id: 2, title: 'Card 2', description: 'This is Cared 2'}
    ]
    return(<div>
        <Card products={products}/>
    </div>)
}
