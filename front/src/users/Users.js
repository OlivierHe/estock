import React, { Component } from 'react';

function UserInfo(props) {
  if (props.logged) {
  return (<ul>
          <li> 
            role : 
            {props.titre}
          </li>
          <li>
            nom prenom : 
            {props.nom}
            </li>
          </ul>
      );
  } else {
    return "you are not allowed to view this page";
  }
}


class Users extends Component {
  constructor(props) {
    super(props);
    this.state= { users :[], logged : false};
};


  componentDidMount() {
    //fetch("/users",{method: "POST", credentials: "include"});
    fetch("/users",{method: "POST", credentials: "include"})
      .then(response => {
        if(response.status === 200) {
          console.log("aucun problèmes");
          response.json().then(users => {
            this.setState({users, logged : true});
            console.log(this.state.users);
          });
        }else{ 
          console.log("erreur d'authenfication");
          this.setState({logged : false});
        }
      });
  }

  render() {
 
    return (
      <div className="Users">
        <UserInfo logged={this.state.logged} titre={this.state.users["titre"]} nom={this.state.users["nom"]} />
      </div>
    );
  }
}

export default Users;
