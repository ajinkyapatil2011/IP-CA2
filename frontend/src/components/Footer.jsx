import React from 'react'
import "./Footer.css";



const Footer = () => {
  return (
    <div className="footerimg">
    <img src="/images/cup.png" alt="Cup" />
    <footer>
        <div className="social">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><img src="/images/facebook.svg" alt="Facebook" /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><img src="/images/insta.svg" alt="Instagram" /></a>
            <a href="https://x.com/home" target="_blank" rel="noopener noreferrer"><img src="/images/twitter.svg" alt="Twitter" /></a>
            <a href="https://in.pinterest.com/" target="_blank" rel="noopener noreferrer"><img src="/images/pinterest.svg" alt="Pinterest" /></a>
        </div>

        <div className="contact">
            CONTACT US
        </div>

        <div className="coninfo">
            <div className="phone">
                <div>Phone Number</div>
                <div>9988776655</div>
            </div>
            <div className="email">
                <div>Email</div>
                <div>2022.ASYA@ves.ac.in</div>
            </div>
        </div>

        <div className="info">
            Welcome to X Salon, where beauty meets excellence. Our dedicated team of professionals is committed to providing personalized beauty services tailored to your unique needs. Whether it's a fresh haircut, a relaxing spa session, or a flawless makeup look, we promise an unforgettable experience. At X Salon, we use only top-quality products and cutting-edge techniques to ensure that you leave feeling confident and refreshed. We value every client and are here to cater to all your beauty and wellness needs. Join us and discover the art of self-care.
        </div>


        <div className="copyright">
            <p>&copy; <span id="current-year">{new Date().getFullYear()}</span> Salon demo. All rights reserved.</p>
        </div>
    </footer>
</div>
  )
}

export default Footer
