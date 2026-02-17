/**
 * Type definitions for @garmin/fitsdk
 */

declare module "@garmin/fitsdk" {
  export class Encoder {
    constructor(options?: { fieldDescriptions?: any });
    writeMesg(message: any): void;
    onMesg(mesgNum: number, message: any): void;
    addDeveloperField(
      key: string,
      developerDataIdMesg: any,
      fieldDescriptionMesg: any,
    ): void;
    close(): Uint8Array;
  }

  export class Decoder {
    constructor(stream: Stream);
    isFIT(): boolean;
    checkIntegrity(): boolean;
    read(options?: {
      mesgListener?: (messageNumber: number, message: any) => void;
      mesgDefinitionListener?: (mesgDefinition: any) => void;
      fieldDescriptionListener?: (
        key: string,
        developerDataIdMesg: any,
        fieldDescriptionMesg: any,
      ) => void;
      applyScaleAndOffset?: boolean;
      expandSubFields?: boolean;
      expandComponents?: boolean;
      convertTypesToStrings?: boolean;
      convertDateTimesToDates?: boolean;
      includeUnknownData?: boolean;
      mergeHeartRates?: boolean;
      decodeMemoGlobs?: boolean;
    }): { messages: any; errors: any[] };
  }

  export class Stream {
    static fromByteArray(bytes: Uint8Array): Stream;
  }

  export const Profile: {
    MesgNum: {
      FILE_ID: number;
      EVENT: number;
      RECORD: number;
      LAP: number;
      SESSION: number;
      ACTIVITY: number;
      [key: string]: number;
    };
    [key: string]: any;
  };

  export const Utils: any;
  export const CrcCalculator: any;
}
