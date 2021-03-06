
import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation } from "src/hooks/translation";

import './SideMenu.module.scss'

interface SideMenuProps {
  orderId?: string
}

export const SideMenu: React.FC<SideMenuProps> = (props) => {
  const { orderId } = props
  const { t } = useTranslation();
  const accountUrl = "#";
  const addressUrl = "#";
  const ordersHistoryUrl = "#";
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectorClicked = () => {
    setIsOpen(!isOpen);
  };

  const handleHideMenu = () => {
    setIsOpen(false);
  };

  const ref = useOnclickOutside(() => {
    setIsOpen(false);
  });

  const sideMenuItems = [
    { to: accountUrl, children: 'my-account' },
    { to: addressUrl, children: 'addresses' },
    { to: ordersHistoryUrl, children: 'orders' }
  ];

  sideMenuItems.push();
  const currentSideMenuItems = sideMenuItems.filter(el => el.to === location.pathname);

  return (
    <div className="sidemenu" ref={ref}>
      <button className="sidemenu__btn" onClick={handleSelectorClicked}>
        {currentSideMenuItems.length > 0 ? t(currentSideMenuItems[0].children) : t("orders")}
      </button>
      <div className={`sidemenu__dropdown ${!isOpen ? 'sidemenu__hidden' : ''}`}>
        {sideMenuItems.map(elem => (
          <div className='sidemenu__item' key={elem.to}>
            <Link to={elem.to}
              className={`sidemenu__link ${(location.pathname === `/orderdetails/${orderId}` || location.pathname.includes('/orders-history/')
              ? (elem.to === ordersHistoryUrl ? '--selected' : '') 
              : (location.pathname === elem.to ? '--selected' : ''))}`}
              onClick={handleHideMenu}>
                {t(elem.children)}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
