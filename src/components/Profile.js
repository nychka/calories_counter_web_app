import React from 'react';
import { currentUser, history } from '../utils';

class Profile extends React.Component{
    logout(){
        history.push({pathname: '/logout'});
    }
    render(){
        const user = currentUser();
        return(
            <div className={'d-flex flex-column meal-new '}>
            <div className={'d-flex flex-row mb-5 align-self-center justify-content-center meal-new-top'}>
             <img src={user.avatar} alt="Card" />
            </div>
            <div className={'d-flex flex-row mb-5 align-self-center meal-new-title'}>{user.email}</div>
            <div className={'d-flex jutify-content-center align-self-center flex-row mb-5'}>
                
                <div className={'d-flex flex-row'}>
                    <div className={'d-flex align-items-center justify-content-center flex-column meal-new-square'}>
                        <img src={'/icons/food-scale-tool.svg'} alt={'calorie'} />
                    </div>
                    <input className={'d-flex flex-column meal-new-square meal-new-square-input'} disabled/>
                </div>

                <div className={'d-flex flex-row'}>
                    <div className={'d-flex align-items-center justify-content-center flex-column meal-new-square'}>
                        <img src={'/icons/calorie.svg'} alt={'calorie'} />
                    </div>
                    <input className={'d-flex flex-column meal-new-square meal-new-square-input'} disabled />
                </div>
    
            </div>
            <div className={'d-flex justify-content-center meal-new-bottom'} onClick={this.logout.bind(this)}>Logout</div>
        </div>
        )
    }
}

export default Profile;