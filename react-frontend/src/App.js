import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SimpleAsset from './components/SimpleAsset.js';
import ShowSum from './components/ShowSum.js';
import axios from 'axios';
import mongoose from 'mongoose';

export default class App extends Component {

  constructor(props) {
    console.log("new App component will be initialized");
    super(props);

    this.handleCreateAsset = this.handleCreateAsset.bind(this);
    this.handleDeleteAsset = this.handleDeleteAsset.bind(this);


    this.state = {
      assets: [],
      currentCount: 0
    }
  }


  componentDidMount() {
    console.log("componentDidMount, assets will be loaded from the database");


    axios.get('http://localhost:8080/assets/').then(response => {

      console.log(response.data);

      //if the application is started for the first time and there are no assets in the database yet, we will create one example asset 

      if (response.data.length === 0) {
        const exampleAsset = {
          _id: mongoose.Types.ObjectId().toString(),
          asset_name: "This is an example, press Edit to change name and Value",
          asset_value: "0"
        }
      
        this.saveAssetToDatabase(exampleAsset);
        
        response.data = [exampleAsset];
      }

      this.setState({
       assets: response.data.map(asset => <SimpleAsset key={asset._id} onDelete={this.handleDeleteAsset} asset={asset} />),
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
            {/*if the JavaScript code returns an array of React components, then the generated code will loop through the array and render all components in the array*/}
            {this.state.assets}

            <ShowSum count={this.state.currentCount}/>   
            
          </tbody>
        </table>
      </div>
    );
  }

  // <ShowSum count="5"/> 


  //the next method is called when the "create asset" button is clicked

  handleCreateAsset() {
    console.log("handleCreateAsset invoked");

    //we create a new empty asset with just an id to identify it

    const newAsset = {
      _id: mongoose.Types.ObjectId().toString(),
      asset_name: "",
      asset_value: ""
    }

    //now we have to add the new asset to the mongodb database
    this.saveAssetToDatabase(newAsset);

    // the react framework only rerenders the UI, when it detects that the state changed
    // when there is an object or an array in the state, the framework doesn't detect if a property of that object or an element of that array changed
    // we have to copy the elements of our array in a new array, in order for react to know, that we want to rerender the UI
    let newAssets = this.state.assets.slice();

    //now we can add the new asset to the new array
    newAssets.push(<SimpleAsset key={newAsset._id} onDelete={this.handleDeleteAsset} edit={true} asset={newAsset} />);

    //we cannot just change the state, in order for react to know that we changed state and want rerendering, we need to call
    //the ".setState()" method. The method takes all properties of the state we want to change as arguments.
    this.setState(
      {
        assets: newAssets,
        currentCount: newAssets.length
      }
    );
    console.log(newAsset);

  }

 
  //the next method is called when the "sell or dispose" button of any of the "SimpleAsset" components is clicked

  handleDeleteAsset(event) {
    const IdOfAssetToDelete = event.target.id;
    console.log("Delete asset with _id:" + IdOfAssetToDelete);

    //we delete the asset identified by the id in the event in the mongodb database, by calling the "delete" api of our express server 

    axios.get('http://localhost:8080/assets/delete/' + IdOfAssetToDelete)
      .then(res => console.log(res.data));

    //now we delete the asset in the UI and trigger an UI update by calling ".setState()"
    let newAssets = this.state.assets.filter(asset => {
      console.log("asset.key:" + asset.key + " IdOfAssetToDelete:" + IdOfAssetToDelete + " " + (asset.key !== IdOfAssetToDelete));
      return asset.key !== IdOfAssetToDelete;
    })
    this.setState(
      {
        assets: newAssets,
        currentCount: newAssets.length
      }
    )
  }

  //the next method is just a helper to save a new asset in the database

  saveAssetToDatabase(asset) {
    axios.post('http://localhost:8080/assets/add', asset)
      .then(res => console.log(res.data));
  }

}

