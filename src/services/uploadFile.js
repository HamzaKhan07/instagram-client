import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import storage from '../firebase/firebase';

async function uploadFile(file){
    const date = Date.now();
    const imageRef = ref(storage, date.toString());

    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);

    return url;
}

export default uploadFile;