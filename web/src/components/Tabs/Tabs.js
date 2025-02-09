import React, {useState} from 'react';
import TabComponent from './Tab/Tab';


const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(children[0].props.label);

    const handleTabClick = (label) => {
        setActiveTab(label);
    };

    return (
        <div>
            <div className="tabs">
                {children.map((child) => (
                    <TabComponent
                        key={child.props.label}
                        label={child.props.label}
                        activeTab={activeTab}
                        onClick={handleTabClick}
                    />
                ))}
            </div>
            {/* Content of the active tab */}
            <div className="tab-content">
                {children.map((child) =>
                    child.props.label === activeTab ? child.props.children : null
                )}
            </div>
        </div>
    );
};

export default Tabs;