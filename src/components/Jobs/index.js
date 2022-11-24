import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {Component} from 'react'
import Header from '../Header'
import './index.css'

const apiProfileConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const apiJobConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  nojobs: 'NOJOBS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    apiType: apiProfileConstants.initial,
    jobDetails: [],
    apiJobType: apiJobConstants.initial,
    employmentType: '',
    minimumPackage: '',
    search: '',
  }

  componentDidMount() {
    this.getJobProfile()
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiJobType: apiJobConstants.loading})

    const {employmentType, minimumPackage, search} = this.state

    const jobApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${search}`
    console.log(jobApiUrl)
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const jobResponse = await fetch(jobApiUrl, options)
    const jobsData = await jobResponse.json()
    console.log(jobResponse)

    if (jobResponse.ok === true) {
      const {jobs} = jobsData
      const updatedJobsData = jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetails: updatedJobsData,
        apiJobType: apiJobConstants.success,
      })
    } else {
      this.setState({
        apiJobType: apiJobConstants.failure,
      })
    }
    if (jobsData.jobs.length === 0) {
      this.setState({apiJobType: apiJobConstants.nojobs})
    }
  }

  getJobProfile = async () => {
    this.setState({apiType: apiProfileConstants.loading})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const profileData = await response.json()

    if (response.ok === true) {
      const updatedData = {
        name: profileData.profile_details.name,
        shortBio: profileData.profile_details.short_bio,
        profileImageUrl: profileData.profile_details.profile_image_url,
      }
      this.setState({
        profileDetails: updatedData,
        apiType: apiProfileConstants.success,
      })
    } else {
      this.setState({apiType: apiProfileConstants.failure})
    }
  }

  addEmploymentType = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.value],
        }),
        this.getJobDetails,
      )
    } else {
      this.setState(
        prevState => ({
          employmentType: prevState.employmentType.filter(
            item => !item.includes(event.target.value),
          ),
        }),
        this.getJobDetails,
      )
    }
  }

  onChangeRadio = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobDetails)
  }

  renderSuccessView = () => {
    const {profileDetails} = this.state
    return (
      <div className="mainProfileContainer">
        <div>
          <div className="profileCardContainer">
            <img
              src={profileDetails.profileImageUrl}
              alt="profile"
              className="profilePic"
            />
            <h1 className="profileName">{profileDetails.name} </h1>
            <p className="shortBio">{profileDetails.shortBio}</p>
          </div>
          <hr className="hrLine" />
          <h1 className="headerListText">Type Of Employment</h1>
          <ul className="employmentList">
            {employmentTypesList.map(eachOne => (
              <div className="checkBoxContainer">
                <li key={eachOne.employmentTypeId} className="listItems">
                  <input
                    id={eachOne.employmentTypeId}
                    value={eachOne.employmentTypeId}
                    type="checkbox"
                    onClick={this.addEmploymentType}
                  />
                  <label htmlFor={eachOne.employmentTypeId}>
                    {eachOne.label}
                  </label>
                </li>
              </div>
            ))}
          </ul>
          <hr className="hrLine" />
          <h1 className="headerListText">Salary Range</h1>
          <ul className="employmentList">
            {salaryRangesList.map(eachType => (
              <div className="checkBoxContainer">
                <li key={eachType.salaryRangeId} className="listItems">
                  <input
                    id={eachType.salaryRangeId}
                    type="radio"
                    value={eachType.salaryRangeId}
                    name="salary range"
                    onChange={this.onChangeRadio}
                  />
                  <label htmlFor={eachType.salaryRangeId}>
                    {eachType.label}
                  </label>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="mainProfileContainer">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickReProfile = () => {
    this.getJobProfile()
  }

  renderFailureView = () => (
    <button type="button" onClick={this.onClickReProfile}>
      Retry
    </button>
  )

  renderSwitchMethod = () => {
    const {apiType} = this.state

    switch (apiType) {
      case apiProfileConstants.loading:
        return this.renderLoadingView()

      case apiProfileConstants.success:
        return this.renderSuccessView()

      case apiProfileConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  onSearchInputValue = event => {
    this.setState({search: event.target.value})
  }

  onSearchClick = () => {
    this.getJobDetails()
  }

  renderJobLoadingView = () => (
    <div className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobSuccessView = () => {
    const {jobDetails} = this.state
    return (
      <>
        <ul className="unorderJobList">
          {jobDetails.map(eachJob => (
            <Link to={`/jobs/${eachJob.id}`} className="linkJobs">
              <li key={eachJob.id} className="list">
                <div className="logoContainer">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="company logo"
                    className="companyLogo"
                  />
                  <div>
                    <h1 className="title">{eachJob.title}</h1>
                    <div className="starRating">
                      <AiFillStar className="star" />
                      <p>{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="cardContainer">
                  <div className="locationEmploy">
                    <div className="le">
                      <MdLocationOn />
                      <p className="employment">{eachJob.location}</p>
                    </div>
                    <div className="le">
                      <BsFillBriefcaseFill />
                      <p className="employment">{eachJob.employmentType}</p>
                    </div>
                  </div>
                  <p>{eachJob.packagePerAnnum}</p>
                </div>
                <hr className="job-card-horizontal-line" />
                <div>
                  <h1 className="descriptionHeading">Description</h1>
                  <p className="descriptionPara">{eachJob.jobDescription}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </>
    )
  }

  onClickJob = () => {
    this.getJobDetails()
  }

  renderJobsFailureView = () => (
    <div className="failureContainer">
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="fview"
        />
        <h1> Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button
          type="button"
          onClick={this.onCLickRetryJobItem}
          className="button"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobSwitchMethod = () => {
    const {apiJobType} = this.state

    switch (apiJobType) {
      case apiJobConstants.loading:
        return this.renderJobLoadingView()

      case apiJobConstants.success:
        return this.renderJobSuccessView()

      case apiJobConstants.failure:
        return this.renderJobsFailureView()

      case apiJobConstants.nojobs:
        return this.renderNoJobsView()

      default:
        return null
    }
  }

  render() {
    const {search} = this.state
    return (
      <div className="profileBgContainer">
        <Header />
        <div className="mainPJContainer">
          {this.renderSwitchMethod()}
          <div className="jobsContainer">
            <div className="searchBar">
              <input
                type="search"
                className="searchInput"
                placeholder="Search"
                onChange={this.onSearchInputValue}
                value={search}
              />
              <button
                type="button"
                className="searchButton"
                onClick={this.onSearchClick}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobSwitchMethod()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
