import Header from '../Header/index'
import './index.css'

const NotFound = () => (
  <>
    <div className="notFoundContainer">
      <Header />
      <div className="notFoundPage">
        <img
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png "
          alt="not found"
        />
        <h1 className="pageText">Page Not Found</h1>
        <p className="paraText">
          we're sorry, the page you requested could not be found
        </p>
      </div>
    </div>
  </>
)

export default NotFound
