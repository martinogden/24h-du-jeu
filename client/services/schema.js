import { Schema, arrayOf } from 'normalizr';


export const game = new Schema('games');
export const arrayOfGames = arrayOf(game);

export const user = new Schema('user');