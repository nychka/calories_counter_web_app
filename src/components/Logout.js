import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { signOut } from "../utils";

class Logout extends React.Component{

    componentDidMount(){
        signOut();
    }
    render(){
      return(
          <Redirect to={'/'}/>
        )
    }
}

export default withRouter(Logout);