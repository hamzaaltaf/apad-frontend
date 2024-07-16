import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';

export default function Card(props) {
    console.log(props)
    const [products, set_products] = React.useState(props.products)

    React.useEffect(() => {
        set_products(props.products)
    })
    console.log("This is products", products)
    const card_objects = products.map((p) => {
        return(<div className='col-md-3 col-xs-12 col-sm-3 col-lg-3'>
            <div className="card" key={p.id}>
                <div className="card-body">
                    <h5 className="card-title">{p.title}</h5>
                    <p className="card-text">{p.description}</p>
                    <Link to='/login' className="btn btn-primary" >Book me!</Link>
                </div>
            </div>
        </div>)
    })
    return(
        <div className='row'>
            {card_objects}
        </div>
    )
}