import { Word } from './word';

export interface Line {
    boundingBox: string;
    words: Word[];
}
