import React, {
    Component
} from 'react';

export default class ShowSum extends Component {

    constructor(props) {
        super(props);
        }
       
        render() {
            return (
            <tr className="sumline">
                <td>total: {this.props.count}</td>
                <td></td>
                <td></td>
            </tr>
        )
        }
    };