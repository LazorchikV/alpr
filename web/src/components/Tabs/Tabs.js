import React, {useState} from 'react';
import Tab from './Tab/Tab';


const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(children[0].props.label);

    // Обработчик переключения вкладок
    const handleTabClick = (label) => {
        setActiveTab(label);
    };

    return (
        <div>
            {/* Заголовки вкладок */}
            <div className="tabs">
                {children.map((child) => (
                    <Tab
                        key={child.props.label}
                        label={child.props.label}
                        activeTab={activeTab}
                        onClick={handleTabClick}
                    />
                ))}
            </div>

            {/* Контент активной вкладки */}
            <div className="tab-content">
                {children.map((child) =>
                    child.props.label === activeTab ? child.props.children : null
                )}
            </div>
        </div>
    );
};

export default Tabs;