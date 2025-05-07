import './homePage.css';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className='homepage'>
      <div className="left">
        <h1>Chat App</h1>
        <h2>Start chatting</h2>
        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae deserunt, optio consequatur amet cupiditate hic, corrupti a nam quos dignissimos iusto. Nostrum eius ad nihil, vel suscipit nam doloribus earum?</h3>
        <Link to='/dashboard'>Get Started</Link>
      </div>
      <div className="right">
        <div className="img_container">
          <img src="./chat.jpg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Homepage