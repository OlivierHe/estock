import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Redirect } from 'react-router';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            password: "",
            error: {},
            open: false,
            isError: false,
            showLogForm: false,
            logged: false,
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    };

    // handle everything related to form control

    handleChange(event) {
        let iNam= event.target.name;
        let iVal= event.target.value;
        let iType = event.target.type;

        this.validation(iNam, iVal, iType);
        this.setState({
          [iNam]: iVal,
        });
       
        console.log(iNam + " " + iVal + " " + iType );
     }
    

    handleLogin() {
        console.log("dans handle login");
        this.setState({isError: false});
        var emptyVal, error = false;
        // vérifie si les champs son vide
        Object.entries(this.state).forEach(([cle, valeur]) => {
          if (cle !=="error" && valeur !== undefined && (valeur === "" || (valeur.constructor === Object && Object.keys(valeur).length === 0))) {
                emptyVal = true;
                this.setState(prevState => {
                  return {
                    error: {
                      ...prevState.error,
                      [cle] : "Le champ doit être rempli",
                      },
                      isError: true
                  };
                });
          }
        });
        // si les champs ne sont pas vide vérifie si des erreur sont présentes dans error
        if(!emptyVal) {
          Object.entries(this.state.error).forEach(([cle, valeur]) => {
              if(valeur !=="") {
                error = true;
              }
          });
          if (!error) {
            console.log("dans fetch");
              fetch('/login', {
                method: 'POST',
                body: JSON.stringify({user: this.state.user, password: this.state.password}),
                headers: {
                  "Content-Type": "application/json"
                },
              }).then(response => {
                  if(response.status === 200) {
                    console.log("aucun problèmes");
                    this.setState({logged : true});
                  }else{ 
                    console.log("erreur d'authenfication");
                    this.setState({open : true});
                  }
                });
          } else {
            console.log("error dans login");
        }
      }
    }

    clearError(name){
        this.setState(prevState => ({
          error: {
            ...prevState.error,
            [name] : "",
            },
        }));
      } 
    
      validation(name, value, type){
        if (type === "text" || type === "password") {
          if ((value.length < 2) || (value.length > 100)) { 
            this.setState(prevState => ({
            error: {
              ...prevState.error,
              [name] : "2 character minimum and 100 maximum",
              },
            }));
          } else { 
            this.clearError(name);
          }
        }
      }
    

    render(){
        const style = {
            label: {
                margin: 12,
            },
            grid: {
               minHeight: '60vh',
               textAlign: 'center'
            },
          };
        if (this.state.logged) {
          return <Redirect to="/" />
        }

        return( 
        <Grid 
            container 
            direction="column"
            justify="center"
            alignItems="center"
            style={style.grid}
        >
            <Paper>
                <form>
                <TextField  error={this.state.error["user"] === undefined || this.state.error["user"] === "" ?(false):(true)} helperText={this.state.error["user"]} variant="outlined" label="user" type="text" name="user" autoComplete="username" value={this.state.user}   style={style.label} onChange={this.handleChange} />
                <br/>
                <TextField error={this.state.error["password"] === undefined || this.state.error["password"] === "" ?(false):(true)} helperText={this.state.error["password"]} variant="outlined" label="password"  type="password" name="password" autoComplete="current-password" value={this.state.password} style={style.label} onChange={this.handleChange}/>
                <br/>
                <Button variant="contained" color="primary" style={style.label} onClick={this.handleLogin}>login</Button>
                </form>
            </Paper>
        </Grid>
        );
    }
}

export default Login;
