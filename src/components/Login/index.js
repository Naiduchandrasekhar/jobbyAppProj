import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showError: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {errorMsg, showError} = this.state
    return (
      <div className="bgContainer">
        <div className="loginContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="websiteLogo"
          />
          <form onSubmit={this.onFormSubmit} className="formContainer">
            <label htmlFor="name" className="label">
              USERNAME
            </label>
            <input
              id="name"
              type="text"
              placeholder="Username"
              className="inputs"
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="inputs"
              onChange={this.onChangePassword}
            />
            <br />
            <button type="submit" className="loginButton">
              Login
            </button>
            {showError && <p className="error">* {errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
