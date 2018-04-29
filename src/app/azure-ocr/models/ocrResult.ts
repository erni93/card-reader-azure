import { Region } from './region';

export interface OcrResult {
    language: string;
    textAngle: number;
    orientation: string;
    regions: Region[];
}
