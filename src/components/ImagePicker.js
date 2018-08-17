import React from 'react';

class ImagePicker extends React.Component{

    render(){
        return(
            <div className="row" style={{border: '1px solid'}}>
                { this.props.suggestions.map(item => (
                    <div className="col" width="60px" key={item.imageId}>
                        <a href='#'>
                            <img src={item.contentUrl} alt='One' width='60px' height='60px' onClick={this.props.pickImageHandler} />
                        </a>
                    </div>
                    ))}
            </div>
        )
    }
}

export default ImagePicker;