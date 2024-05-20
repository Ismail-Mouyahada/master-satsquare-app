import React, { useState } from 'react';
import { FaCalendarAlt, FaUsers, FaFileAlt, FaChartBar, FaHeart, FaShieldAlt, FaSignOutAlt, FaBtc, FaCogs, FaDonate, FaBuilding, FaUserAlt, FaLightbulb, FaGamepad, FaBars } from 'react-icons/fa';
import styles from './Sidebar.module.css';
import Link from 'next/link';
import { Tooltip } from "@nextui-org/tooltip";

const links = [
    { href: "/utilisateurs", icon: <FaUsers />, tooltip: "Utilisateurs" },
    { href: "/roles", icon: <FaShieldAlt />, tooltip: "Roles" },
    { href: "/quiz", icon: <FaGamepad />, tooltip: "Quizzes" },
    { href: "/statistiques", icon: <FaChartBar />, tooltip: "Stats" },
    { href: "/sponsors", icon: <FaHeart />, tooltip: "Sponsors" },
    { href: "/associations", icon: <FaBuilding />, tooltip: "Associations" },
    { href: "/donations", icon: <FaDonate />, tooltip: "Donations" },
    { href: "/evenements", icon: <FaCalendarAlt />, tooltip: "Evenements" },
    { href: "/profile", icon: <FaUserAlt />, tooltip: "Profile" },
    { href: "/lightning", icon: <FaLightbulb />, tooltip: "Lightning" },
    { href: "/configurations", icon: <FaCogs />, tooltip: "Configurations" },
];

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={styles.sidebar}>
                <div className={`${styles.sidebar} ${isOpen ? 'open' : ''}`}>
                    <div className='flex items-center justify-center w-full h-16 bg-[#12095c]'  ><FaBtc className=' scale-[2]' /></div>
                    <div className={styles.main}>
                        {links.map((link, index) => (
                            <Tooltip key={index} showArrow={true} placement='right' className='px-2 mr-1 rounded-md bg-[#352B5B]' content={link.tooltip}>
                                <Link href={link.href} className={styles.iconMiddle}>{link.icon}</Link>
                            </Tooltip>
                        ))}
                    </div>
                    <div className='flex items-center justify-center w-10 h-10 text-red-500 bg-opacity-75 rounded-full hover:bg-opacity-90 bg-slate-100'  ><FaSignOutAlt className=' scale-[1.2]' /></div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
