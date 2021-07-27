import {Island} from "./island";
import {MoussaillonRights} from "./moussaillon-rights";
import {Sea} from "./sea";
import {Commander} from "./commander";
import {Member} from "./member";

export class MoussaillonData {
    islands: Map<number, Island> = new Map<number, Island>();
    rights: MoussaillonRights = new MoussaillonRights();
    members : Map<number, Member> = new Map<number, Member>();
    seas: Map<number, Sea> = new Map<number, Sea>();
    commanders: Map<number, Commander> = new Map<number, Commander>();
}