import React, {
    Component
} from 'react';
import axios from 'axios';

export default class ShowSum extends Component {

    constructor(props) {
        super(props);

        this.getCount = this.getCount.bind(this);

        this.state = {
            currentCount: props.count
        }
        }

        componentDidMount() {

            this.getCount();

        }

        render() {

            this.getCount();

            return (
            <tr className="sumline">
                <td>sum:</td>
                <td>{this.state.currentCount}</td>
                <td></td>
            </tr>
        )
        }

       getCount() {
        axios.get('http://localhost:8080/assets/')
        .then(response => {

            this.setState({currentCount: response.data.length });
            //console.log('### zeich! ', response.data.length);



       })
       .catch(err=> console.log('Mist gebaut: ', err))

       } 

    };