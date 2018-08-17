import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { signOut } from "../utils";

class Logout extends React.Component{

    componentWillMount(){
        console.log('will mount');
    }
    componentDidMount(){
        console.log('mount');
        signOut();
    }
    render(){
        console.log('render');
      return(
          <Redirect to={'/'}/>
        )
    }
}

export default withRouter(Logout);