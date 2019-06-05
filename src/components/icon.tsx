import * as React from 'preact';


export class Icon extends React.Component<{name:string}> {

    render() {
        return (
            <svg class="icon">
                <use xlinkHref={'#' + this.props.name}></use>
            </svg>
        );
    }
}