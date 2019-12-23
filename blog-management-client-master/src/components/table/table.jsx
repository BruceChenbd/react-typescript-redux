import * as React from 'react'
import './table.less'
const $  = require('jquery')
class animateTable extends React.Component {
    componentDidMount () {
        const listPanel = $('#a ul');
        let nubcers = 0; 
        function scroll() { 
            listPanel.animate({ 
                'top': (nubcers - 40) + 'px'
            }, 1500, 'linear', function() {
                listPanel.css({
                    'top': '0px'
                }).find("li:first").appendTo(listPanel)
                scroll();
            });
        }
        scroll();
    }
    componentWillUnmount () {
    }
    render() {
        return (
            <div className='ceShiTable'>
                <div className='ceShiTable-title'>
                    <span className='ceShiTable-text2'>告警列表</span>
                </div>
                <div
                    ref='newDiv'
                    id="a"
                    className='ceShiTable-body'
                >
                    <ul id="b" ref='newDivUI'>
                        {this.props.data && this.props.data.length > 0
                            ?
                            this.props.data.map(this.tableBody)
                            : <span className='noData'>暂无数据</span>

                        }
                    </ul>
                </div>
            </div>
        );
    }
    tableBody = (item, index) => {
        return (
            <li key={index}>
                <span className='ceShiTable-text2'>
                   {item.name}
                </span>
            </li>
        );
    }
}

export default animateTable