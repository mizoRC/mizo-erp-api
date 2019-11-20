import { isUUID } from 'validator';

export const isValidUUID = string => {
    //const regex = new RegExp("/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i");
    return isUUID(string);
}