import React from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'rc-progress';
import { Navbar } from 'reactstrap';

class Header extends React.Component
{
    constructor(props) {
        super(props);

        this.siteName = 'Calories Counter';
        this.state = {
            isOpen: false,
            progressPercent: 0
        };
    }

    pickToday = () => {
        console.log('click');
        this.props.pickMoment(this.props.todayMoment);
    }

    render(){
        const progress = this.props.consumedCalories / (this.props.caloriesLimit / 100);
        return(
            <div className={'mb-3'}>
                <Navbar className="">
                    <Link to="/">
                        <div onClick={this.pickToday.bind(this)} className='brand d-flex justify-content-left'>{ this.siteName }</div>
                    </Link>
                    <div className={'d-flex justify-content-center brand'}>{this.props.consumedCalories} / {this.props.caloriesLimit}</div>
                    <div className={'d-flex justify-content-right'}>
                        <Link to={'/login'}>Sign in</Link>
                    </div>
                </Navbar>
                <Line percent={progress} className={'rounded'} strokeWidth="0.4" strokeColor={ this.props.isPresentMoment() ? '#42d8d8' : '#267979' } />
            </div>
        );
    }
}

export default Header;