import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabPanel(props) {
  const { children, value,h, index, ...other} = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && (children)}
    </div>
  );
};
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
export default function CustomTabs(props) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event,newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <AppBar position="sticky" >
        <Tabs value={value} 
        onChange={handleChange} 
        aria-label="Records Table Tabs" 
        TabIndicatorProps={{
          style: {
            backgroundColor: "#f39122"
           }
          }}
          className="tabs-bar-for-tables"
        >
            {props.tabHeads && props.tabHeads.map((tabVal,i)=>{
                return(
                    <Tab key={i} label={tabVal} {...a11yProps(i)}/> 
                )
            })}
        </Tabs>
      </AppBar>
      {props.tabHeads && props.tabHeads.map((tabVal,i)=>{
            return(
                <TabPanel h={tabVal}  key={i} value={value} index={i}>
                {props.children[value]}
                </TabPanel>
            )
        })}
    </>
  );
}