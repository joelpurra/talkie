
/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type IApiGroundworkConfiguration from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-configuration.mjs";

import MessageBusGroundworkBase from "./message-bus-groundwork-base.mjs";

export default class MessageBusGroundworkConfiguration extends MessageBusGroundworkBase implements IApiGroundworkConfiguration {
	// TODO: assert response types.
	async getIsPremiumEdition(): Promise<boolean> {
		return this.bespeak("service:premium:isPremiumEdition");
	}

	async setIsPremiumEdition(isPremiumEdition: boolean): Promise<void> {
		await this.betoken("service:settings:setIsPremiumEdition", isPremiumEdition);
	}

	async getSpeakLongTexts(): Promise<boolean> {
		return this.bespeak("service:settings:getSpeakLongTexts");
	}

	async setSpeakLongTexts(speakLongTexts: boolean): Promise<void> {
		await this.betoken("service:settings:setSpeakLongTexts", speakLongTexts);
	}

	async getShowAdditionalDetails(): Promise<boolean> {
		return this.bespeak("service:settings:getShowAdditionalDetails");
	}

	async setShowAdditionalDetails(showAdditionalDetails: boolean): Promise<void> {
		await this.betoken("service:settings:setShowAdditionalDetails", showAdditionalDetails);
	}

	async getSpeakingHistoryLimit(): Promise<number> {
		return this.bespeak("service:settings:getSpeakingHistoryLimit");
	}

	async setSpeakingHistoryLimit(speakingHistoryLimit: number): Promise<void> {
		await this.betoken("service:settings:setSpeakingHistoryLimit", speakingHistoryLimit);
	}

	async getContinueOnTabRemoved(): Promise<boolean> {
		return this.bespeak("service:settings:getContinueOnTabRemoved");
	}

	async setContinueOnTabRemoved(continueOnTabRemoved: boolean): Promise<void> {
		await this.betoken("service:settings:setContinueOnTabRemoved", continueOnTabRemoved);
	}

	async getContinueOnTabUpdatedUrl(): Promise<boolean> {
		return this.bespeak("service:settings:getContinueOnTabUpdatedUrl");
	}

	async setContinueOnTabUpdatedUrl(continueOnTabUpdatedUrl: boolean): Promise<void> {
		await this.betoken("service:settings:setContinueOnTabUpdatedUrl", continueOnTabUpdatedUrl);
	}
}
