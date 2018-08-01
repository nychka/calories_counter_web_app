import React from 'react';

class ImagePicker extends React.Component{

    state = {
        image: 'http://4.bp.blogspot.com/-PB1VYJjSCQE/UREBbiEkphI/AAAAAAAAARM/a1tawzVrOA0/s1600/banana.jpeg'
    }

    render(){
        return(
            <div className="row" style={{border: '1px solid'}}>
                { this.props.suggestions.map(item => {
                   return <div className="col" width="60px">
                                <a href='#'>
                                    <img key={item.imageId} src={item.contentUrl} alt='One' width='60px' height='60px' onClick={this.props.pickImageHandler} />
                                </a>
                            </div>
                })}
            </div>
        )
    }
}

export default ImagePicker;