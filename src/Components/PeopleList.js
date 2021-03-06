import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PeopleListDetail from './PeopleListDetail';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';
class PeopleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleData:[],
    };
    this.getPeopleInformation = this.getPeopleInformation.bind(this);
  }
  getPeopleInformation() {
    let totalPageData = [];
    let promises = [];
    for (let i = 1; i < 10; i++) {
      promises.push(`https://swapi.co/api/people/?page=${i}`);
    }
    console.log(promises);
    axios.all(promises.map(p => axios.get(p)))
     .then(axios.spread((...responses) => {
       responses.forEach(res => {
         totalPageData = totalPageData.concat(res.data.results);
         console.log(res.data.results);
         console.log(totalPageData)
       })
       this.setState({ peopleData: totalPageData});
     })
    )
    
  }

  componentDidMount() {
    this.getPeopleInformation()
  }
  
  render() {
    const columns = [
      {
        Header: () => (
          <div>
            <p className="name-first">Star-war characters'<span className="name-second"> name</span></p>
          </div>
        ),
        accessor:'name',
        
        Cell: (row) => {
          let data = this.state.peopleData;
          return (
            <div className="people-style">
              {data[row.index].name}  
            </div>
          )
        },
        width: 250
      },{
        Header: () => (
          <div>
            <p className="name-first">Detail of<span className="name-second"> People</span></p>
          </div>
        ),
        Cell: (row) => {
          let data = this.state.peopleData;
          let pathName = `/${row.index + 1}`;
          return (
            <div>
              <Router>
                <Link to={pathName}>
                  <button
                    className="people-style"
                  >
                  {`Detail of ${data[row.index].name}`}
                  </button>
                </Link>
                <Switch>
                  <Route path={pathName} render = {() => {
                    return <PeopleListDetail url={`https://swapi.co/api/people/${row.index + 1}`}></PeopleListDetail>
                  }}></Route>
                </Switch>
              </Router>

                
            </div>
          )
        } 
        
      }]
    console.log(this.state.peopleData)
    return (
      <div>
        <ReactTable
          data={this.state.peopleData}
          columns={columns} 
          className="-striped -highlight"
          pageSize={87}
        />
      </div>
    );
  }
}

export default PeopleList;