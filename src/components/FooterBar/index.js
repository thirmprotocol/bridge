/* eslint-disable react-hooks/exhaustive-deps */
import { FooterWrapper } from './style';

function HeaderBar() {


  return (
    <FooterWrapper>
      <ul className="footer-menu">
        <li>
          <a href="//thirm.com" target="_blank" rel="noreferrer nofollow">Website</a>
        </li>
        <li>
          <a href="//stats.thirm.com" target="_blank" rel="noreferrer nofollow">Stats</a>
        </li>
        <li>
          <a href="//docs.thirm.com" target="_blank" rel="noreferrer nofollow">Documentation</a>
        </li>
      </ul>
      <div>
        <p>All Rights Reserved. 2021</p>
      </div>

    </FooterWrapper>
  );
}

export default HeaderBar;
