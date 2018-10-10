import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import App from './../main/App';
import Profile from './../profile/Profile';
import Login from './../login/Login';
import Users from './../users/Users';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  link: {
    textDecoration: 'none',
  }
};

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <Router>
      <div className='router'>
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                  <MenuIcon />
                </IconButton>
                <Typography variant="title" color="inherit" className={classes.grow}>
                  E-stock
                </Typography>
                  <div>
                    <IconButton
                      aria-owns={open ? 'menu-appbar' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={open}
                      onClose={this.handleClose}
                    >
                    <div className={classes.link}>
                      <Link to="/" className={classes.link}><MenuItem onClick={this.handleClose}>Home</MenuItem></Link>
                      <Link to="/profile" className={classes.link}><MenuItem onClick={this.handleClose}>Profile</MenuItem></Link>
                      <Link to="/users" className={classes.link}><MenuItem onClick={this.handleClose}>Utilisateurs</MenuItem></Link>
                      <Link to="/login" className={classes.link}><MenuItem onClick={this.handleClose}>Log in</MenuItem></Link>
                    </div>  
                    </Menu>
                  </div>
              </Toolbar>
            </AppBar>
          </div>
              <Route exact path="/" component={App}/>
              <Route path="/profile" component={Profile}/>
              <Route path="/users" component={Users}/>
              <Route path="/login" component={Login}/>
          </div>
      </Router>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);