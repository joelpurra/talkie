/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import PropTypes from "prop-types";
import React from "react";

import Icon from "../../../shared/components/icon/icon.jsx";
import configureAttribute from "../../../shared/hocs/configure.jsx";
import styled from "../../../shared/hocs/styled.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";

export default
@configureAttribute
@translateAttribute
class Menu extends React.PureComponent {
	constructor(props) {
		super(props);

		this.styled = {
			a: styled({
				borderRadius: "0.3em",
				display: "block",
				height: "2em",
				lineHeight: "2em",
				textDecoration: "none",
			})(textBase.a),

			li: styled({
				display: "block",
				marginBottom: "0.25em",
				marginTop: "0.25em",
				verticalAlign: "middle",
			})("li"),

			ol: styled({
				listStyle: "none",
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				paddingBottom: 0,
				paddingLeft: 0,
				paddingRight: 0,
				paddingTop: 0,
			})("ol"),
		};
	}

	static propTypes = {
		configure: PropTypes.func.isRequired,
		onConfigurationChange: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
	}

	componentDidMount() {
		this._unregisterConfigurationListener = this.props.onConfigurationChange(() => this.forceUpdate());
	}

	componentWillUnmount() {
		this._unregisterConfigurationListener();
	}

	render() {
		const {
			configure,
			translate,
		} = this.props;

		return (
			<layoutBase.nav>
				<this.styled.ol>
					<this.styled.li>
						<this.styled.a href={configure("urls.demo-voices")} rel="noopener noreferrer" target="_blank">
							<Icon className="icon-voices"/>
							{translate("frontend_PopupMenu_Voices")}
						</this.styled.a>
					</this.styled.li>
					<this.styled.li>
						<this.styled.a href={configure("urls.demo-usage")} rel="noopener noreferrer" target="_blank">
							<Icon className="icon-usage"/>
							{translate("frontend_PopupMenu_Usage")}
						</this.styled.a>
					</this.styled.li>
					<this.styled.li>
						<this.styled.a href={configure("urls.demo-features")} rel="noopener noreferrer" target="_blank">
							<Icon className="icon-features"/>
							{translate("frontend_PopupMenu_Features")}
						</this.styled.a>
					</this.styled.li>
					<this.styled.li>
						<this.styled.a href={configure("urls.demo-support")} rel="noopener noreferrer" target="_blank">
							<Icon className="icon-feedback"/>
							{translate("frontend_supportAndFeedback")}
						</this.styled.a>
					</this.styled.li>
				</this.styled.ol>
			</layoutBase.nav>
		);
	}
}
