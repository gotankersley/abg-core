import * as React from 'preact';

export class DropdownItem extends React.Component<{name:string}> {
	render () {
		return (
			<a href="#" class="dropdown-item">{this.props.name}</a>
		);
	}
}

export class Dropdown extends React.Component {
	state = {isActive:false}
	handleClick = (e) => {
		var toggledActive = !this.state.isActive;
		this.setState({isActive:toggledActive})
	}
	render() {
		var activeClass = this.state.isActive? ' is-active' : '';

		return (
			<div class="panel-block">
				<div class={'dropdown' + activeClass}>
					<div class="dropdown-trigger" onClick={this.handleClick}>
						<button class="button" aria-haspopup="true" aria-controls="dropdown-menu">		
							<span>Player 1</span>
						</button>
					</div>

					<div class="dropdown-menu" id="dropdown-menu" role="menu">					
						<div class="dropdown-content">
							{this.props.children}												
						</div>
					</div>
				</div>
			</div>
		);
	}
}