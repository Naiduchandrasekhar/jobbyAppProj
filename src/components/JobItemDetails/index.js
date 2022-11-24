import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'
import Header from '../Header'

const apiJobItemConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsData: {},
    similarJobsData: [],
    skillsData: [],
    LifeAtCompanyData: {},
    apiType: apiJobItemConstants.initial,
  }

  componentDidMount() {
    this.getAllJobDetails()
  }

  onCLickRetryJobItem = () => {
    this.getAllJobDetails()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills.map(eachItem => ({
      imageUrl: eachItem.image_url,
      name: eachItem.name,
    })),
    title: data.title,
  })

  getFormattedSimilarJobData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getAllJobDetails = async () => {
    this.setState({apiType: apiJobItemConstants.loading})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const jobDetails = this.getFormattedData(data.job_details)
      const updatedSimilarJobsData = data.similar_jobs.map(eachJob =>
        this.getFormattedSimilarJobData(eachJob),
      )
      this.setState({
        jobDetailsData: jobDetails,
        similarJobsData: updatedSimilarJobsData,
        skillsData: jobDetails.skills,
        LifeAtCompanyData: jobDetails.lifeAtCompany,
        apiType: apiJobItemConstants.success,
      })
    } else {
      this.setState({apiType: apiJobItemConstants.failure})
    }
  }

  renderJobLoadingView = () => (
    <div className="loaderJobs">
      <div>
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    </div>
  )

  renderJobSuccessView = () => {
    const {
      jobDetailsData,
      skillsData,
      LifeAtCompanyData,
      similarJobsData,
    } = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetailsData

    return (
      <div className="mainJobItemContainer">
        <div className="jobItemsContainer">
          <div className="jobLogoContainer">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="jobCompanyLogo"
            />
            <div>
              <h1 className="jobTitle">{title}</h1>
              <div className="jobStarRating">
                <AiFillStar className="starLogo" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="JobCardContainer">
            <div className="JobLocationEmploy">
              <div className="JobLe">
                <MdLocationOn className="locationAndInternshipLogos" />
                <p className="JobEmployment">{location}</p>
              </div>
              <div className="JobLe">
                <BsFillBriefcaseFill className="locationAndInternshipLogos" />
                <p className="JobEmployment">{employmentType}</p>
              </div>
            </div>
            <p className="salary">{packagePerAnnum}</p>
          </div>
          <hr className="jobs-card-horizontal-line" />
          <div>
            <div className="VisitContainer">
              <h1 className="jobDescription">Description</h1>
              <div>
                <a className="visitLink" href={companyWebsiteUrl}>
                  Visit
                </a>
                <FiExternalLink />
              </div>
            </div>
            <p className="jobDescriptionPara">{jobDescription}</p>
          </div>
          <div className="skills">
            <h1>Skills</h1>
            <ul className="listSkillLogos">
              {skillsData.map(eachSkill => (
                <li key={eachSkill.name} className="skillList">
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skillLogo"
                  />
                  <p className="skillName">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <h1 className="lifeAtCompanyHeading">Life at Company</h1>
          <div className="lifeAtCompany">
            <div>
              <p className="lifeAtCompanyPara">
                {LifeAtCompanyData.description}
              </p>
            </div>
            <img src={LifeAtCompanyData.imageUrl} alt="life at company" />
          </div>
        </div>
        <div className="similarCardContainer">
          <div>
            <h1 className="similarJobsHeading">Similar Jobs</h1>
            <ul className="unorderSimilarCardList">
              {similarJobsData.map(eachData => (
                <li key={eachData.id} className="similarCardItem">
                  <div className="jobLogoContainer">
                    <img
                      src={eachData.companyLogoUrl}
                      alt="similar job company logo"
                      className="jobCompanyLogo"
                    />
                    <div>
                      <h1 className="jobTitle">{eachData.title}</h1>
                      <div className="jobStarRating">
                        <AiFillStar className="starLogo" />
                        <p>{eachData.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="jobDescription">Description</h1>
                    <p className="similarjobDescriptionPara">
                      {eachData.jobDescription}
                    </p>
                  </div>
                  <div className="JobLocationEmploy">
                    <div className="JobLe">
                      <MdLocationOn className="locationAndInternshipLogos" />
                      <p className="JobEmployment">{eachData.location}</p>
                    </div>
                    <div className="JobLe">
                      <BsFillBriefcaseFill className="locationAndInternshipLogos" />
                      <p className="JobEmployment">{eachData.employmentType}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderJobItemFailureView = () => (
    <div className="jobItemFailure">
      <div className="failureContainer">
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

  renderSwitchJobItems = () => {
    const {apiType} = this.state

    switch (apiType) {
      case apiJobItemConstants.loading:
        return this.renderJobLoadingView()

      case apiJobItemConstants.success:
        return this.renderJobSuccessView()

      case apiJobItemConstants.failure:
        return this.renderJobItemFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobBgContainer">
        <Header />
        {this.renderSwitchJobItems()}
      </div>
    )
  }
}

export default JobItemDetails
