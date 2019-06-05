import * as React from 'preact';

export class ConfigItem extends React.Component<{name:string, val:any, title?:string, persist?:string}> {
	state = {val:this.props.val=='true'? true :false};
	constructor(props) {
		super(props);				
		var checked = this.props.val == 'true'? true : false;
		window.menu[this.props.name] = checked;
		
	}


	
	loadPersisted(name, defaultVal):boolean {
		var propertyName = 'TTT.' + name;
		if (localStorage.getItem(propertyName) !== null) {
			var val = localStorage.getItem(propertyName);
			if (val == 'true') return true;
			else if (val == 'false') return false;			
		}
		return false;//throw new Error('Invalid property' + name);
	}

	onClick = (checked, e) => {			
		window.menu[this.props.name] = checked;
		this.setState({val:checked});
	}

	render () {
		var name = this.props.title? this.props.title : this.props.name;
		var checked = this.state.val;
		return (
			<div class="panel-block">
				<label class="checkbox">
					<input type="checkbox" checked={checked} onClick={this.onClick.bind(this,!checked)}/>
					{name}
				</label>
			</div>
		);
	}
}

export class LinkItem extends React.Component<{name:string, url:string}> {
	render () {
		return (
			<div class="panel-block">
				<a href={this.props.url} target="_blank">{this.props.name}</a>
			</div>
		);
	}
}

export class ConfigPanel extends React.Component<{name:string, icon?:string, active?:boolean}> {

	render () {	
		var visible = this.props.active? ' active-tab' : '';
		return (
						
			<div class={'tab-content' + visible}>{this.props.children}</div>
		);
	}
}