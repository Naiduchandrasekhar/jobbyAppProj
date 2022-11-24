import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const clickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="mainHeader">
      <div className="headerContainer">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            alt="website logo"
            className="headerLogo"
          />
        </Link>
        <div className="homeJobs">
          <Link to="/" className="link">
            <h1 className="homeText">Home</h1>
          </Link>
          <Link to="/jobs" className="link">
            <h1>Jobs</h1>
          </Link>
        </div>
        <button className="logoutButton" type="button" onClick={clickLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
export default withRouter(Header)
