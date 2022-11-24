import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div>
    <Header />
    <div className="headerBgContainer">
      <div className="findJobsContainer">
        <ul className="unorderHomeRoute">
          <li>
            <h1 className="headingText">Find The Job That Fits Your Life</h1>
          </li>
          <li>
            <p className="para">
              Millions of people are searching for jobs, salary, information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
          </li>
          <li>
            <Link to="/jobs">
              <button type="button" className="button">
                Find Jobs
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
)

export default Home
