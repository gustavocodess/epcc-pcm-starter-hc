/*
* Safe check localStorage for a value at a given key
* Automatically convers from JSON and returns undefined if any issues,
* for instance of localStorage is disabled in a user's browser
*/
export function safeLsGet(key: string) {
 try {
   const val = localStorage.getItem(key);
   if (typeof val === 'string') {
     return JSON.parse(val);
   }
 } catch (err) {
   console.debug('Localstorage get error', err);
 }
 return undefined;
}

/**
* Safe set localStorage value at a given key
* Automatically convers to JSON and returns undefined if any issues,
* for instance of localStorage is disabled in a user's browser
*/
export function safeLsSet(key: string, value: any) {
 try {
   localStorage.setItem(key, JSON.stringify(value));
   return true;
 } catch (err) {
   console.debug('Localstorage set error', err);
 }
 return false;
}