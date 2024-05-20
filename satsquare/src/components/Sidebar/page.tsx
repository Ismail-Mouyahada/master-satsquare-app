// components/Sidebar.tsx

import React from 'react';
import { FaCalendarAlt, FaUsers, FaFileAlt, FaChartBar, FaHeart, FaLeaf, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.icon}><FaCalendarAlt /></div>
            <div className={styles.main}>
                <div className={styles.icon}><FaUsers /></div>
                <div className={styles.icon}><FaFileAlt /></div>
                <div className={styles.icon}><FaChartBar /></div>
                <div className={styles.icon}><FaHeart /></div>
                <div className={styles.icon}><FaLeaf /></div>
                <div className={styles.icon}><FaShieldAlt /></div>
            </div>
            <div className={styles.icon}><FaSignOutAlt /></div>
        </div>
    );
};

export default Sidebar;
