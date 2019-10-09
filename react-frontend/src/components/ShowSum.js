import React, {
    Component
} from 'react';

export default class ShowSum extends Component {

    constructor(props) {
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

        calculateSum(list) {
            return list.reduce((acc, value) => {return acc+value.asset_value},0)  }

    }

