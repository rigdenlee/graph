import React, { Component } from 'react';
import axios from 'axios';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend,
  GradientDefs
} from 'react-vis';

const COLORS = [
  '#6588cd',
  '#66b046',
  '#a361c7',
  '#ad953f',
  '#c75a87',
  '#55a47b',
  '#cb6141',
  '#cb6141'

];
class App extends Component {
  state = {
    productDetails: [],
    date: '2015-01-08',
    error: '',
    show: true,
    hoveredItem: false
  };


  onSubmitHandler = (event) => {
    event.preventDefault();
      console.log(this.state.date)
      axios.get(`http://localhost:5000/api/graphdata/${this.state.date}`)
      .then(res => {
        if(res.data.length !== 0) {
        res.data.forEach(pname => {
          return this.setState((prevState) => {
            return {
              productDetails: prevState.productDetails.concat([{name: pname.productname, bugs: pname.numberofbugs,
              error: ""
              }])}
          });
        });
      } else {
        return this.setState({
          error: "This is invalid"
        })
      }
        console.log(res);})
      .catch(error => this.setState({
        error: error
      }))
    }
    
  dateHandler = (event) => {
    this.setState({
      date: event.target.value
    })
  }


  render() {
    const BarSeries = VerticalBarSeries; 

    let err = '';
    if(this.state.error) {
      err = <h1>Invalid date</h1>;
    } else {
      err = '';
    }
    
    const Barseries = this.state.productDetails.map((data, index) => {
      return <BarSeries
              key={index}
              cluster="2015"
              color={COLORS[data.bugs]}
              data={[
                {x: data.name, y: data.bugs},
              ]}
            />
    });

    return (
      <div style={{position: 'relative'}}>
        <input type="date" onChange={(event) => this.dateHandler(event)} value={this.state.date}/><br/>
        {/* <input type="date" onChange={(event) => this.dateHandler(event)} value="2015-01-08"/><br/> */}
        <button type="submit" onClick={this.onSubmitHandler}>Search</button>

        <button
          onClick={() => this.setState({show: !this.state.show})}
          style={{"marginLeft": "50%"}}
        >Toggle</button>
        {err}
        {this.state.show ?
          <XYPlot
            className="clustered-stacked-bar-chart-example"
            style={{'marginLeft': "30%"}}
            xType="ordinal"
            stackBy="y"
            width={500}
            height={500}
          >
              <svg height={20} width={20}>
                <GradientDefs>
                    <pattern id="stripes" width="4" height="4" patternUnits="userSpaceOnUse">
                        <path d="M 0, 0 l 5, 5" stroke="#45aeb1" strokeLinecap="square" />
                    </pattern>
                    <pattern id="circles" width="3" height="3" patternUnits="userSpaceOnUse">
                      <circle cx="1.5" cy="1.5" r="0.8" fill="magenta" />
                    </pattern>
                </GradientDefs>
              </svg>
               <DiscreteColorLegend 
                        colors={COLORS[this.state.productDetails.map(data => data.bugs)]}
                        style={{position: 'absolute', top: '10%', left: '3%'}}
                        width={500}
                        onItemMouseEnter={i => this.setState({hoveredItem: i})}
                        onItemMouseLeave={() => this.setState({hoveredItem: false})}
                        orientation="horizontal"
                        items={this.state.productDetails.map(
                          (item, key) =>
                            this.state.hoveredItem === item.name ? (
                              <div key={key}>
                                {item.name}(
                                {item.bugs})
                              </div>
                            ) : (
                              item.name
                            )
                        )}
                      />
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            {Barseries}
          </XYPlot> 
        : " "}
        
      </div>
    );
  }
}

export default App;