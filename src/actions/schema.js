import { Schema, arrayOf } from 'normalizr';


export const game = new Schema('game');
export const arrayOfGames = arrayOf(game);