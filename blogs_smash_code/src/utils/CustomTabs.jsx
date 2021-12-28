import * as React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, } from "@material-ui/core";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            className="min-h-100"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                 children 
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


export default function CustomTabWrapper({ tabValue, setTabValue, tabHeads, tabPanels }) {

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div>
            <div>
                <Tabs value={tabValue} onChange={handleChange} aria-label="Files Manage">
                    {tabHeads && tabHeads.map((tabTop, index) => {
                        return (
                            <Tab key={index} label={tabTop?.title} icon={tabTop.icon} />
                        )
                    })}
                </Tabs>
            </div>
            {tabPanels && tabPanels.map((tab, ind) => (
                <TabPanel key={ind} value={tabValue} index={ind}>
                    {tab}
                </TabPanel>
            ))}
        </div>
    );
}