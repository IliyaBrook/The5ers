import React from 'react';
import Image from 'next/image';
import styles from './AppHeader.module.scss';

interface AppHeaderLogoProps {
  onClick?: () => void;
}

const AppHeaderLogo: React.FC<AppHeaderLogoProps> = ({ onClick }) => {
  return (
    <div className={styles.header__logoWrapper} onClick={onClick}>
      <Image
        src="/company_logo.jpg"
        alt="The5ers Logo"
        width={40}
        height={40}
        className={styles.header__logoImage}
      />
    </div>
  );
};

export default AppHeaderLogo;
