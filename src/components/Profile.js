import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, NavLink } from 'reactstrap';
import { currentUser } from "../utils";

class Profile extends React.Component{
    render(){
        return(
            <div className="container">
                <Card>
                    <CardImg top width="200px" src={'#'} alt="avatar" />
                    <CardBody>
                        <CardTitle>{currentUser().email}</CardTitle>
                        <CardSubtitle><NavLink tag={Link} className={'btn btn-warning'} to={'/logout'}>Log out</NavLink></CardSubtitle>
                        <CardText>

                        </CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Profile;