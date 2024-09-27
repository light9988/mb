import React from 'react';
import Button from './Button';
import AccordionSection from './AccordionSection';
import './Career.css';

function Career() {
    return (
        <main className="main" id="main">
            {/* <img className="panel-card-img" src="https://images.unsplash.com/photo-1554048968-670223ca9141?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Mercedes-Benz logo picture" /> */}
            <div className='video'>
                <iframe
                    width="1100"
                    height="600"
                    src="https://www.youtube.com/embed/nfxTgysD9jw"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <h2 className='main-title' id="career-title">Opeing Jobs</h2>
            <div className='card' id="card-job">
                <h3 className='card-title'>Development Engineer, Connectivity Systems</h3>
                <p>Location: Seattle, WA</p>
                <p>Work Style: Hybrid</p>
                <p>Full-time</p>
                <h4>About the job</h4>
                <p>Embedded in a worldwide network Mercedes-Benz Research & Development North America continuously strives to remain at the forefront of successful automotive research and development. MBRDNA is headquartered in Silicon Valley, California, with key areas of Autonomous Driving, Advanced Interaction Design, Digital User Experience, Machine Learning, Customer Research, and Open Innovation. In Farmington Hills, Michigan, the focus is on Powertrain and eDrive technology as well as in Long Beach, where the teams test durability of the latest driver assistant and telematic systems. The Digital Hub in Seattle focusses on developing a cloud architecture and building out the cloud platform for the next generation of connected car services. The Testing and Regulatory Affairs Division in Ann Arbor and the Advanced Vehicle Design in Carlsbad complete the competence center. </p>
                <p>Responsible for testing, validation, and verification of telematics component development, especially the Telematic Control Unit (TCU), ensuring high maturity, on-time delivery, and overall system qualification. </p>
                <h4>Job Responsibilities</h4>
                <ul>
                    <li>Take responsibility for the testing, verification, and validation of telematics components, more specifically related to the Telematic Control Unit, internet connectivity, emergency call services, and remote services for the US market</li>
                    <li>Support resolution of technical problems, report errors, promote systematic issues, collect supporting documentation and traces, and promptly communicate technical and quality related issues obtained from the testing, validation and verification process to the department’s teams and the headquarters in Germany</li>
                    <li>Ability to use log analysis tools to capture, interpret and understand backend/cloud log files</li>
                    <li>Ability to work independently and without regular management support to determine tasks priorities and focus</li>
                    <li>Ability to recognize risks in telematics development and use this information to prioritize tasks</li>
                    <li>Demonstrates good judgment in selecting methods and techniques related to test configuration, test plans and test drives</li>
                    <li>Takes initiative to identify, communicate, and execute changes or improvements</li>
                    <li>Ability to organize and execute Domestic and International (Canada) test drives for specific functions or components</li>
                    <li>Ability to work in a joint test team collaboration between the onboard and offboard testing teams</li>
                </ul>
                <h4>Basic Qualifications</h4>
                <ul>
                    <li>Bachelor of Science in Electrical or Computer Engineering consider; Computer Science, Mathematics, or related field of study</li>
                    <li>Experience in the development or validation of embedded systems in the automotive or consumer electronics industries, or similar experience</li>
                    <li>Understanding of Telematics, ideally Telematics Control Units</li>
                    <li>Testing, validation, and verification experience</li>
                    <li>Ability to operate a Vehicle both on local roads and highways as needed for dynamic testing</li>
                    <li>Intermediate proficiency in Microsoft Office suite</li>
                    <li>Frequent use of speech, vision, hearing, use of hands for computer use and presentations</li>
                    <li>Frequent sitting, standing and reaching with hands</li>
                    <li>Driving is required for this position</li>
                </ul>
                <h4>Preferred Qualifications</h4>
                <ul>
                    <li>revious Automotive OEM or Tier1 supplier work experience</li>
                    <li>Experience with embedded software and automotive solutions</li>
                    <li>Strong technical knowledge of Mercedes-Benz vehicles</li>
                    <li>Strong technical knowledge of Mercedes-Benz vehicles</li>
                    <li>Experience with wireless network development and testing, Connected Car space, and GSM/CDMA wireless technologies</li>
                </ul>
                <h4>Benefits for Full-Time* Employees Include:</h4>
                <ul>
                    <li>Medical, dental, and vision insurance for employees and their families</li>
                    <li>401(k) with employer match</li>
                    <li>Up to 18 company-paid holidays</li>
                    <li>Paid time off (unlimited for salaried employees), sick time, and parental leave</li>
                    <li>Tuition assistance program</li>
                    <li>Wellness/Fitness reimbursement programs</li>
                    <li>Vehicle lease subsidy or company car (for eligible employees only)</li>
                </ul>
                <p>* Internships excluded from Full-Time Employee benefits</p>
                <p>Mercedes-Benz Group is an equal opportunity employer (EOE) and strongly supports diversity in the workforce. MBG only accepts resumes from approved agencies who have a valid Agency Agreement on file. Please do not forward resumes to our applicant tracking system, MBG employees, or send to any MBG location. MBG is not responsible for any fees or claims related to receipt of unsolicited resumes.</p>
                <p>* Please submit your application to: career@mercedesbenzgroup.com, or apply online.</p>
                <Button className="button" type="button" visual="button">
                    Apply
                </Button>
            </div>
            <div className='content'>
                <h2 className='main-title' id="section-title">More Open Positions:</h2>
                <AccordionSection title="North & Central America">
                    <ul className='joblist'>
                        <li>Canada</li>
                        <li>Mexico</li>
                        <li>USA</li>
                    </ul>
                </AccordionSection>
                <AccordionSection title="Europe">
                    <ul className='joblist'>
                        <li>Belgium</li>
                        <li>Czech Republic</li>
                        <li>Denmark</li>
                        <li>France</li>
                        <li>Germany</li>
                        <li>Italy</li>
                        <li>Poland</li>
                        <li>Russian Federation</li>
                        <li>Sweden</li>
                        <li>Span</li>
                        <li>United Kingdom</li>
                    </ul>
                </AccordionSection>
                <AccordionSection title="Asia">
                    <ul className='joblist'>
                        <li>China</li>
                        <li>China HongKong</li>
                        <li>India</li>
                        <li>Indonesia</li>
                        <li>Japan</li>
                        <li>South Korea</li>
                        <li>Malaysia</li>
                        <li>Singapore</li>
                        <li>Thailand</li>
                        <li>Turkey</li>
                        <li>Vietnam</li>
                    </ul>
                </AccordionSection>
                <AccordionSection title="Africa">
                    <ul className='joblist'>
                        <li>Egypt</li>
                    </ul>
                </AccordionSection>
                <AccordionSection title="South America">
                    <ul className='joblist'>
                        <li>Brasil</li>
                    </ul>
                </AccordionSection>
                <AccordionSection title="Austrialia & Pacific">
                    <ul className='joblist'>
                        <li>Australia</li>
                        <li>New Zealand</li>
                    </ul>
                </AccordionSection>
            </div>
        </main>
    );
};

export default Career;