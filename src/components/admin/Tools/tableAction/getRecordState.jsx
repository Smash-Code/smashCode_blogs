import { connect } from "react-redux";

// FUNCTION to ...... get match record states like new,update,or pending from database 

function GtRecState(props) {
  const records = [
    { id: 1, title: "New" },
    {  id: 2, title: "Edit", },
    {  id: 3, title: "Pending", },
    {  id: 4, title: "Blocked", },
  ];
  let num = parseInt(props.no || 1);
  return records[num -1]?.title;
}

const mapStateToProps = (store) => ({
  records: store.recordStates,
});

export default connect(mapStateToProps, null)(GtRecState)