import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "./App.css";

function SetChartType({Select, Data}:any){
  const [type, setType] = useState("scatter")
  const [showing, setShowing] = useState(0)
  return(
    <div>
    <ShowData ChartType={type} Choosed={Select} Data={Data} typeOfInfo={showing}></ShowData>
    <button onClick={() => {if(type == "scatter"){setType("bar")}else{setType("scatter")}}}>
      Chart Type is {type}
    </button>
    <button onClick={() => {
      switch (showing){
        case 1: 
          setShowing(0);
          break;
        default: 
          setShowing(1);
          break;
      }
      }}>
      Change type of showing info
    </button>
    </div>
  )
}

function sortByDate(array: any[]): any[]{
  let choose = array[0]
  let higher = []
  let lower = []
  if(array.length <= 1){
    return array
  } else{
    for(let element = 1; element <= array.length; element++){
      if(array[element] < choose){
        lower.push(array[element])
      } else if (array[element] > choose){
        higher.push(array[element])
      }
    }
    return sortByDate(lower).concat([choose], sortByDate(higher))
  }
}

function getData(){
  const ConnUrl = "http://127.0.0.1:8000/";
  const [posts, setPosts]:any = useState([]);
  useEffect(() => {
    async function Data(url: any) {
      let rawData = await fetch(url);
      let newData = await rawData.json();
      setPosts(newData);
    }
    Data(ConnUrl);
  }, []);

    return posts
}

function Choosing(){
  const arrayOfNames = getData();
  const [choosed, setChoosed] = useState("phone")
  let Product = Object.keys(arrayOfNames)
  if(arrayOfNames.length ==0){
    return <p>loading ...</p>
  }else{
  return(
    <div>
      <SetChartType Select={choosed} Data={arrayOfNames}></SetChartType>
      <div>
        {
          Array.from({length: Product.length}, (_, index) => (
            <button
              id={Product[index]}
              onClick={() => setChoosed(Product[index])}
            >
              {Product[index]}
            </button>
          ))
        }
      </div>
    </div>
    )
  }
}

function ShowData({ChartType, Choosed, Data, typeOfInfo}: any) {
  const dataForPlot = Data
  let selected = Choosed
  //const currentProduct = Choosed
  const rawXax = Object.keys(dataForPlot[selected][0])
  let sortedXax = sortByDate(rawXax)
  let xax = []
  for(let i = 0; i<sortedXax.length; i++){
    xax.push(Date.parse(sortedXax[i]))
  }
  let yay = []
  for(let i =0; i<sortedXax.length; i++){
    yay.push(dataForPlot[selected][0][sortedXax[i]][typeOfInfo])
  }
  if(ChartType == "scatter"){
  return (
     <Plot
          data={[
            {
              x: xax,
              y: yay,
              type: "scatter",
              mode: "lines+markers",
            },
          ]}
          layout={{ width: 1100, height: 500, title: { text: selected }, xaxis: { type: 'date', tickformat: '%b %d, %Y',
          dtick: 86400000.0, tickangle: -45}}}
        />
  );} else {
      return (
     <Plot
          data={[
            { type: "bar", x: xax, y: yay },
          ]}
          layout={{ width: 1100, height: 500, title: { text: selected }, xaxis: { type: 'date', tickformat: '%b %d, %Y',
          dtick: 86400000.0, tickangle: -45}}}
        />
    );
  }
}






function App() {
  return (
    <>
      <div className="card">
        <Choosing></Choosing>
      </div>
    </>
  );
}
export default App;