import React, { Component } from 'react';
import './App.css';
import SimpleAsset from './components/SimpleAsset';
import ShowSum from './components/ShowSum';
import axios from 'axios';
import mongoose from 'mongoose';

interface IProps {}

interface IState {
  assets: IAsset[];
  currentCount: number;  
}

export interface IAsset {
  _id: string;
  asset_name: string;
  asset_value: number;
}

export default class App extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    console.log("new App component will be initialized");
    super(props);

    this.handleCreateAsset = this.handleCreateAsset.bind(this);
    this.handleDeleteAsset = this.handleDeleteAsset.bind(this);
    this.refreshApp = this.refreshApp.bind(this);


    this.state = {
      assets: [],
      currentCount: 0
    }
  }


  componentDidMount() {
    //console.log("componentDidMount, assets will be loaded from the database");


    axios.get('http://localhost:8080/assets/').then(response => {

      console.log(response.data);

      if (response.data.length === 0) {
        const exampleAsset = {
          _id: mongoose.Types.ObjectId().toString(),
          asset_name: "This is an example, press Edit to change name and Value",
          asset_value: 5
        }
      
        this.saveAssetToDatabase(exampleAsset);
        
        response.data = [exampleAsset];
      }

      this.setState({
       assets: response.data,
        currentCount: response.data.length
      });
    }).catch(function (error) { console.log(error); })
  }

   render() {
    return (
      <div>
        <h1>simple asset management application</h1>
        <p>to create a new asset click this button:&nbsp;
        { /*we can insert dynamic data into the static parts of the HTML, by writing JavaScript code within curly brackets */}
          <button onClick={this.handleCreateAsset}>create asset</button>
        </p>
        <table>
          <tbody>
            <tr><th>description</th><th>value</th><th>action</th></tr>
          

            {this.state.assets.map((asset) => 
            <SimpleAsset key={asset._id} onDelete={this.handleDeleteAsset} refresh={this.refreshApp} edit={false} asset={asset} /> )}

            <ShowSum count={this.state.currentCount} assets={this.state.assets}/>   
            
          </tbody>
        </table>
      </div>
    );
  }

  handleCreateAsset() {
    console.log("handleCreateAsset invoked");

    const newAsset = {
      _id: mongoose.Types.ObjectId().toString(),
      asset_name: "This is an example, press Edit to change name and Value",
      asset_value: 0
    }

    this.saveAssetToDatabase(newAsset);

    let newAssets = this.state.assets.slice();

    newAssets.push(newAsset);

    this.setState(
      {
        assets: newAssets,
        currentCount: newAssets.length
      }
    );
  }

 
  handleDeleteAsset(event:any) {
    const IdOfAssetToDelete = event.target.id;
    //console.log("Delete asset with _id:" + IdOfAssetToDelete);


    axios.get('http://localhost:8080/assets/delete/' + IdOfAssetToDelete)
      .then(res => console.log(res.data));

    let newAssets = this.state.assets.filter(asset => {
      return asset._id !== IdOfAssetToDelete;
    })
    this.setState(
      {
        assets: newAssets,
        currentCount: newAssets.length
      }
    )
  }

  saveAssetToDatabase(asset:IAsset) {
    axios.post('http://localhost:8080/assets/add', asset)
      .then(res => console.log(res.data));
  }

  refreshApp(asset:IAsset) {

  let assetIndex = this.state.assets.findIndex(assetElem => assetElem._id === asset._id);

  let newAssets = this.state.assets.slice();

  newAssets[assetIndex] = asset;

    this.setState({
      assets: newAssets
    });
  }

}

