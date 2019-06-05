import * as React from "preact";
import {Icon} from "./icon";
import {ConfigPanel} from "./config-panel";

export class Sidebar extends React.Component {
		state = {activeTab:0, panelHeading:'Players'};

		constructor() {
			super();
			window.menu.activeTab = 0;
		}

		componentDidMount() {			
		}

		onChangeTab = (id, tabName, e) => {	
			window.menu.activeTab = id;		
			this.setState({activeTab:id, panelHeading:tabName});			
		}
		
		renderTabs() {
			//Dynamically build from child elements
			var tabs = [];			
			var children = this.props.children;
			// @ts-ignore
			for (var i = 0; i < children.length; i++) { 
				var child = children[i];
				var name = child.attributes['name'];
				var icon = child.attributes['icon'];
				tabs.push(
					<a onClick={this.onChangeTab.bind(this, i, name)}>
						<Icon name={icon} />
						<span>{child.attributes['name']}</span>
					</a>
				);			
				
			}
			return tabs;
		}

		renderPanels() {
			//Dynamically build from child elements
			var panels = [];			
			var children = this.props.children;
			// @ts-ignore
			for (var i = 0; i < children.length; i++) { 
				var child = children[i];
				var name = child.attributes['name'];
				var icon = child.attributes['icon'];
				var isActive = (this.state.activeTab == i)? true : false;
								
				panels.push(React.cloneElement(child, { active:isActive}));					
				
			}
			return panels;
			
		}

		render () {
			var activeTab = this.state.activeTab;			
			var icon = this.props.children[activeTab].attributes['icon'];
			return (      
				<nav class="panel" style={{float:'right'}}>
  					<p class="panel-heading"><Icon name={icon}/>{this.state.panelHeading}</p>

					<p class="panel-tabs">{this.renderTabs()}</p>
					{this.renderPanels()}
					{/* {this.props.children} */}
					
				</nav>
			);
		}
}