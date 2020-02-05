/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

import React from "react";
import PropTypes from "prop-types";

import translateAttribute from "../../../shared/hocs/translate.jsx";
import styled from "../../../shared/hocs/styled.jsx";

import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";
import * as lighter from "../../../shared/styled/text/lighter.jsx";
import * as tableBase from "../../../shared/styled/table/table-base.jsx";

import Icon from "../../../shared/components/icon/icon.jsx";

import ProgressContainer from "../../containers/progress-container.jsx";

export default
@translateAttribute
class Status extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);

        this.styled = {
            table: styled({
                borderSpacing: 0,
            })(tableBase.table),

            tbody: styled({
                borderSpacing: 0,
            })(tableBase.tbody),

            tr: styled({
                borderSpacing: 0,
            })(tableBase.tr),

            td: styled({
                borderSpacing: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
            })(tableBase.td),

            statusIconWrapper: styled({
                paddingRight: "2em",
            })(textBase.span),
        };
    }

    static propTypes = {
        playPauseClick: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
    }

    handlePlayPauseClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.playPauseClick();

        return false;
    }

    render() {
        const {
            translate,
        } = this.props;

        return (
            <layoutBase.main>
                <lighter.p>
                    {translate("frontend_PopupUsageShort")}
                </lighter.p>

                <this.styled.table>
                    <colgroup>
                        <col width="0*" />
                        <col width="100%" />
                    </colgroup>
                    <this.styled.tbody>
                        <this.styled.tr>
                            <this.styled.td>
                                <this.styled.statusIconWrapper
                                    onClick={this.handlePlayPauseClick}
                                >
                                    <Icon mode="standalone" className="icon-talkie-status" />
                                </this.styled.statusIconWrapper>
                            </this.styled.td>
                            <this.styled.td>
                                <ProgressContainer />
                            </this.styled.td>
                        </this.styled.tr>
                    </this.styled.tbody>
                </this.styled.table>
            </layoutBase.main>
        );
    }
}
