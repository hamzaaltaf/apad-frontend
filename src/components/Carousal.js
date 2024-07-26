import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import PropTypes from 'prop-types';

export default function Carousal({title, description, img_url}) {
    return(
        
        <div id="customCarousel1" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
            <div className="carousel-item active">
                
                <div className="row">
                    <div className="col-md-12">
                        <div className="detail-box">
                            <h1>
                            {title}<br/>
                            </h1>
                            <p>
                            {description}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="img-box">
                            <img src={img_url} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}