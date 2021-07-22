import {Sea} from "./sea";
import {Commander} from "./commander";

export class Island {
    readonly name: string;
    readonly id: number;
    sea: Sea | undefined;
    private _npc: string | undefined;
    commander: Commander | undefined;
    private _cardCode: string | undefined;
    private _cardName: string | undefined;
    private _claimed: string | undefined;
    private _poneglyphe: string | undefined;
    private _boat: string | undefined;
    private _routeFrom: string | undefined;
    private _routeTo: string | undefined;
    private _calmBelt: string | undefined;
    private _moreInfo: string | undefined;

    constructor(id: number, name: string) {
        if(isNaN(id))
            throw Error ("Not a valid ID");
        this.id = id;
        this.name = name;
    }

    get npc(): string {
        if (!this._npc || this._npc.length === 0)
            return "Inconnu"
        else
            return this._npc;
    }

    set npc(value: string) {
        this._npc = value;
    }

    get cardCode(): string {
        if (!this._cardCode || this._cardCode.length === 0)
            return "Inconnu"
        else
            return this._cardCode;
    }

    set cardCode(value: string) {
        this._cardCode = value;
    }

    get cardName(): string {
        if (!this._cardName || this._cardName.length === 0)
            return "Inconnu"
        else
            return this._cardName;
    }

    set cardName(value: string) {
        this._cardName = value;
    }

    get claimed(): string {
        if (!this._claimed || this._claimed.length === 0)
            return "Non"
        else
            return this._claimed;
    }

    set claimed(value: string) {
        this._claimed = value;
    }

    get poneglyphe(): string {
        if (!this._poneglyphe || this._poneglyphe.length === 0)
            return "Non"
        else
            return this._poneglyphe;
    }

    set poneglyphe(value: string) {
        this._poneglyphe = value;
    }

    get boat(): string {
        if (!this._boat || this._boat.length === 0)
            return "Non........"
        else
            return this._boat;
    }

    set boat(value: string) {
        this._boat = value;
    }

    get routeFrom(): string {
        if (!this._routeFrom || this._routeFrom.length === 0)
            return "Inconnu"
        else
            return this._routeFrom;
    }

    set routeFrom(value: string) {
        this._routeFrom = value;
    }

    get routeTo(): string {
        if (!this._routeTo || this._routeTo.length === 0)
            return "Inconnu"
        else
            return this._routeTo;
    }

    set routeTo(value: string) {
        this._routeTo = value;
    }

    get calmBelt(): string {
        if (!this._calmBelt || this._calmBelt.length === 0)
            return "Inconnu"
        else
            return this._calmBelt;
    }

    set calmBelt(value: string) {
        this._calmBelt = value;
    }

    get moreInfo(): string {
        if (!this._moreInfo || this._moreInfo.length === 0)
            return "."
        else
            return this._moreInfo;
    }

    set moreInfo(value: string) {
        this._moreInfo = value;
    }
}