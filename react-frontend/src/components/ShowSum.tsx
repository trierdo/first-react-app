import React from 'react';
//import React, {Component} from 'react';
import { IAsset } from '../App';

interface IState { }
interface IProps {
    count: number;
    assets: IAsset[];
}

export default class ShowSum extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);


        this.calculateSum = this.calculateSum.bind(this);
        }
       
        render() {

            return (
            <tr className="sumline">
                <td>total: {this.props.count}</td>
                <td>sum: {this.calculateSum(this.props.assets)} €</td>
                <td></td>
            </tr>
        )
        }

        calculateSum(list: IAsset[]) {
            return list.reduce((acc, value) => {return acc+value.asset_value},0)  }

    }

