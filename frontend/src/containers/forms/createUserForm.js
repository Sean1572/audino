import React from "react";
import axios from "axios";
import { withRouter } from "react-router";
import { withStore } from "@spyna/react-store";
import { setAuthorizationToken } from "../../utils";
import Alert from "../../components/alert";
import { Button } from "../../components/button";

class CreateUserForm extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.authNeeded)
    const authNeeded = this.props.authNeeded === 'true';
    this.initialState = {
      authNeeded,
      username: "",
      password: "",
      role: "user",
      errorMessage: "",
      successMessage: "",
      isSubmitting: false,
    };

    this.state = Object.assign({}, this.initialState);
  }

  resetState() {
    this.setState(this.initialState);
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleRoleChange(e) {
    this.setState({ role: e.target.value });
  }

  handleUserCreation(e) {
    e.preventDefault();

    this.setState({ isSubmitting: true });
    //var authNeeded = this.authNeeded;
    //console.log(authNeeded)
    const { username, password, role, authNeeded } = this.state;
    console.log(authNeeded)
    const { history } = this.props;

    if (!username || username === "") {
      this.setState({
        isSubmitting: false,
        errorMessage: "Please enter a valid username!",
        successMessage: "",
      });
      return;
    }

    if (!password || password === "") {
      this.setState({
        isSubmitting: false,
        errorMessage: "Please enter a valid password!",
        successMessage: "",
      });
      return;
    }

    if (authNeeded && (!role || !["1", "2"].includes(role))) {
      this.setState({
        isSubmitting: false,
        errorMessage: "Please select a valid role!",
        successMessage: "",
      });
      return;
    }

    var apiurl = ""

    if (authNeeded) {
      apiurl = "api/users";
    } else {
      apiurl = "api/users/no_auth"
    }
    console.log(apiurl)
    axios({
      method: "post",
      url: apiurl,
      data: {
        username,
        password,
        role,
        authNeeded,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          if (!authNeeded) {
            //var index = window.location.href.indexOf("/newUser")
            //var path =  window.location.href.substring(0, index);
            //window.location.href = path
            apiurl = "api/projects/example"
            axios({
              method: "patch",
              url: apiurl,
              data: {
                users: username,
              },
            })
              .then((response) => {
                if (response.status === 200) {
                  this.handleLoggingIn(e)
                }
              })
            .catch((error)=> {
              this.setState({
                errorMessage: error.response.data.message,
                successMessage: "",
                isSubmitting: false,
              });
            });
          } else {
            this.resetState();
            this.form.reset();
            this.setState({ successMessage: response.data.message });
          }
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.response.data.message,
          successMessage: "",
          isSubmitting: false,
        });
      });
  }

  handleLoggingIn(e) {
    e.preventDefault();
    this.setState({ isSigningIn: true });

    const { username, password } = this.state;
    const { history } = this.props;

    axios({
      method: "post",
      url: "/auth/login",
      data: {
        username,
        password,
      },
    })
      .then((response) => {
        this.resetState();
        this.setState({
          successMessage: "Logging you in...",
        });

        const { access_token, username, is_admin } = response.data;

        localStorage.setItem("access_token", access_token);

        setAuthorizationToken(access_token);

        this.props.store.set("username", username);
        this.props.store.set("isAdmin", is_admin);
        this.props.store.set("isUserLoggedIn", true);

        history.push("/dashboard");
      })
      .catch((error) => {
        this.setState({
          isSigningIn: false,
          successMessage: "",
          errorMessage: error.response.data.message,
        });
      });
  }

  handleAlertDismiss(e) {
    e.preventDefault();
    this.setState({
      successMessage: "",
      errorMessage: "",
    });
  }

  render() {
    const { isSubmitting, errorMessage, successMessage, authNeeded } = this.state;
    return (
      <div className="container h-75 text-center">
        <div className="row h-100 justify-content-center align-items-center">
          <form
            className="col-6"
            name="new_user"
            ref={(el) => (this.form = el)}
          >
            {errorMessage ? (
              <Alert
                type="danger"
                message={errorMessage}
                onClose={(e) => this.handleAlertDismiss(e)}
              />
            ) : null}
            {successMessage ? (
              <Alert
                type="success"
                message={successMessage}
                onClose={(e) => this.handleAlertDismiss(e)}
              />
            ) : null}
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                autoFocus={true}
                required={true}
                onChange={(e) => this.handleUsernameChange(e)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                required={true}
                onChange={(e) => this.handlePasswordChange(e)}
              />
            </div>
            {authNeeded &&
              <div className="form-group">
                <select
                  className="form-control"
                  name="role"
                  onChange={(e) => this.handleRoleChange(e)}
                >
                  <option value="-1">Choose role</option>
                  <option value="1">Admin</option>
                  <option value="2">User</option>
                </select>
              </div> 
            }
            <div className="form-row">
              <div className="form-group col">
                <Button
                  size="lg"
                  type="primary"
                  disabled={isSubmitting ? true : false}
                  onClick={(e) => this.handleUserCreation(e)}
                  isSubmitting={isSubmitting}
                  text="Save"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStore(withRouter(CreateUserForm));
