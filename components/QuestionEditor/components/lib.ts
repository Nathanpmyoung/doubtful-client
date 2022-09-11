
import * as Y from 'yjs';

export function getValueFromYDoc(doc:Y.Doc, key:string){
    if(key.startsWith('metadata.')) {
        const metadata = doc.getMap('metadata');
        const _key = key.replace('metadata.', '');
        return metadata.get(_key);
    } else {
        return doc.get(key);
    }
}