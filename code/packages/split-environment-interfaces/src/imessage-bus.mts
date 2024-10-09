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

import type {
	JsonObject,
	JsonValue,
} from "type-fest";

import type {
	TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE,
} from "./imessage-bus-provider.mjs";

// NOTE: background script (webextension) assumed to have a singleton context; service worker and offscreen (chrome) do not need to check the context.
export type MessageBusContextSingletons =
	| "background";

// NOTE: randomly generated numeric suffix because some contexts are not singletons, created in parallel and/or over time.
export type MessageBusContextPlurals =
	| "options"
	| "popup";

export type MessageBusContextIdentifier =
	| MessageBusContextSingletons
	| `${MessageBusContextPlurals}-${number}`;

export interface MessageBusContextTag {
	// NOTE: need to use arbitrary strings instead of an enum because (at least) the multi-instance options page, which may be opened in more than one tab/window.
	talkieContext: MessageBusContextIdentifier;
}

// TODO: separate/split/"namespace" action string types.
export type MessageBusAction =
	| "extension:icon-click"

	| "offscreen:clipboard:read"
	| "offscreen:synthesizer:getAllSafeVoiceObjects"
	| "offscreen:synthesizer:resetSynthesizer"
	| "offscreen:synthesizer:resolveDefaultSafeVoiceObjectForLanguage"
	| "offscreen:synthesizer:resolveSafeVoiceObjectByName"
	| "offscreen:synthesizer:speakTextInVoice"

	| "dom:internal:passSelectedTextToBackground"

	| "service:speaking:speakFromClipboard"
	| "service:speaking:speakInCustomVoice"
	| "service:speaking:speakInLanguageWithOverrides"
	| "service:speaking:speakInVoiceWithOverrides"
	| "service:speaking:stop"

	| "service:voices:getEffectivePitchForVoice"
	| "service:voices:getEffectiveRateForVoice"
	| "service:voices:getEffectiveVoiceForLanguage"
	| "service:voices:setVoicePitchOverride"
	| "service:voices:setVoiceRateOverride"
	| "service:voices:toggleLanguageVoiceOverrideName"

	| "service:premium:isPremiumEdition"

	| "service:settings:getContinueOnTabRemoved"
	| "service:settings:getContinueOnTabUpdatedUrl"
	| "service:settings:getIsPremiumEdition"
	| "service:settings:getShowAdditionalDetails"
	| "service:settings:getSpeakingHistoryLimit"
	| "service:settings:getSpeakLongTexts"
	| "service:settings:setContinueOnTabRemoved"
	| "service:settings:setContinueOnTabUpdatedUrl"
	| "service:settings:setIsPremiumEdition"
	| "service:settings:setShowAdditionalDetails"
	| "service:settings:setSpeakingHistoryLimit"
	| "service:settings:setSpeakLongTexts"

	| "service:history:clearSpeakingHistory"
	| "service:history:getMostRecentSpeakingEntry"
	| "service:history:getSpeakingHistory"
	| "service:history:removeSpeakingHistoryEntry"

	| "broadcaster:history:changed"
	| "broadcaster:history:most-recent:changed"
	| "broadcaster:progress:update"
	| "broadcaster:setting:changed"
	| "broadcaster:speaking:entire:after"
	| "broadcaster:speaking:entire:before"
	| "broadcaster:speaking:part:after"
	| "broadcaster:speaking:part:before"
	| "broadcaster:synthesizer:reset"

	| "development:dummy:multiply-random";

export enum MessageBusResponseModes {
	"response:required" = "response:required",
	"response:acknowledgment" = "response:acknowledgment",
	"response:disallowed" = "response:disallowed",
}

export type MessageBusResponseMode = keyof typeof MessageBusResponseModes;

export type MessageBusDirectionPairing =
	| "direction:simplex:outbound:trigger"
	| "direction:simplex:inbound:reaction"

	| "direction:request:outbound:request"
	| "direction:request:inbound:response"

	| "direction:bullhorn:outbound:shout"
	| "direction:bullhorn:inbound:silence";

// chosen by fair dice roll.
// guaranteed to be random.
// https://xkcd.com/221/
// https://datatracker.ietf.org/doc/html/rfc1149
export const TALKIE_MESSAGE_BUS_IDENTIFIER = 4;

export interface MessageBusMessageBase extends JsonObject {
	_talkieIdentifier: typeof TALKIE_MESSAGE_BUS_IDENTIFIER;
	_talkieMessageIdentifier: number;
	action: MessageBusAction;
	direction: MessageBusDirectionPairing;
	responseMode: MessageBusResponseMode;
}

export interface MessageBusMessageWithData extends MessageBusMessageBase {
	datum: Readonly<JsonValue>;
}

export type MessageBusMessage = MessageBusMessageBase | MessageBusMessageWithData;

export type MessageBusMessageInContext = MessageBusMessage & MessageBusContextTag;

// TODO: generic types?
export type MessageBusActionHandler<MessageData extends Readonly<JsonValue> = Readonly<JsonValue>, Response extends Readonly<JsonValue> = Readonly<JsonValue>> = (action: MessageBusAction, data?: Readonly<MessageData>) => Promise<Response | typeof TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE | void>;
